from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import SessionLocal, engine, get_db
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from app.utils.token import create_access_token
from app.utils.mixpanel_logger import track_event
from datetime import datetime
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.auth import create_access_token, verify_token
from fastapi import Security
from typing import List

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_token(token, HTTPException(status_code=401, detail="Invalid token"))

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print("Received user: ",user)
    db_user = db.query(models.User).filter(models.User.userid == user.userid).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    # Track Mixpanel event after user is successfully registered
    track_event(
        user.userid,
        "User Registered",
        {
            "role": user.role,
            "registration_time": str(datetime.utcnow())
        }
    )
    return crud.create_user(db, user)


@app.post("/login")
def login(login_req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.userid == login_req.userid).first()
    if not user or not pwd_context.verify(login_req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "userid": user.userid, "role": user.role}

"""@app.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.userid == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.userid})
    return {"access_token": access_token, "token_type": "bearer"}"""

@app.post("/products/", response_model=schemas.ProductOut)
def create_product_endpoint(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)


@app.get("/products/", response_model=list[schemas.ProductOut])
def get_all_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.put("/products/{product_id}", response_model=schemas.ProductOut)
def update_existing_product(product_id: int, updated_product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.update_product(db, product_id, updated_product)

@app.delete("/products/{product_id}")
def delete_existing_product(product_id: int, db: Session = Depends(get_db)):
    crud.delete_product(db, product_id)
    return {"message": "Product deleted successfully"}

"""@app.post("/cart/add")
def add_to_cart(item: schemas.CartItemCreate,user_id:str,  db: Session = Depends(get_db)):
    return crud.add_to_cart(db, item, user_id)

@app.get("/cart/", response_model=list[schemas.CartItemCreate])
def get_cart_items(user_id:str,db: Session = Depends(get_db)):
    return crud.get_cart_items(db, user_id)

@app.delete("/cart/clear")
def clear_cart(db: Session = Depends(get_db)):
    return crud.clear_cart(db)"""

# Get all cart items for a user
@app.get("/cart/items", response_model=List[schemas.CartItemOut])
def get_cart_items(user_id: str = Query(...), db: Session = Depends(get_db)):
    return db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()

# Add item to cart
@app.post("/cart/add", response_model=schemas.CartItemOut)
def add_to_cart(item: schemas.CartItemCreate, user_id: str = Query(...), db: Session = Depends(get_db)):
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == user_id,
        models.CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += 1
    else:
        new_item = models.CartItem(**item.dict(), user_id=user_id)
        db.add(new_item)

    db.commit()
    db.refresh(existing_item if existing_item else new_item)
    return existing_item if existing_item else new_item

# Remove item from cart by ID
@app.delete("/cart/remove")
def remove_item_from_cart(user_id: str, product_id: int, db: Session = Depends(get_db)):
    cart_item = db.query(models.CartItem).filter_by(user_id=user_id, product_id=product_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}


# Clear all cart items for a user
@app.delete("/cart/clear")
def clear_cart(user_id: str = Query(...), db: Session = Depends(get_db)):
    db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()
    db.commit()
    return {"detail": "Cart cleared"}




@app.post("/orders/create", response_model=schemas.OrderOut)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order_from_cart(db, order)

@app.get("/orders/history")
def get_order_history(user_id: str, db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()

    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this user.")

    return [
        {
            "created_at": order.created_at,
            "items": [
                {
                    "product_name": item.product_name,
                    "price": item.price,
                    "quantity": item.quantity,
                }
                for item in order.items
            ],
        }
        for order in orders
    ]