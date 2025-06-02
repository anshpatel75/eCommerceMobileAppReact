from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app import models, schemas
from .models import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = pwd_context.hash(user.password)
    db_user = User(userid=user.userid, hashed_password=hashed_pw, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_all_products(db: Session, skip: int = 0, limit: int = 8):
    return db.query(models.Product).offset(skip).limit(limit).all()

# Update product
def update_product(db: Session, product_id: int, product_data: schemas.ProductCreate):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        for field, value in product_data.dict().items():
            setattr(product, field, value)
        db.commit()
        db.refresh(product)
    return product

# Delete product
def delete_product(db: Session, product_id: int):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        db.delete(product)
        db.commit()
    return product


# Add item to cart
"""def add_to_cart(db: Session, item: schemas.CartItemCreate, user_id: str):
    db_item = models.CartItem(
        user_id=user_id,
        product_id=item.product_id,
        product_name=item.product_name,
        price=item.price,
        quantity=item.quantity,
        image=item.image
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item"""

def add_to_cart(db: Session, item: schemas.CartItemCreate, user_id: str):
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == user_id,
        models.CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        db_item = models.CartItem(
            user_id=user_id,
            product_id=item.product_id,
            product_name=item.product_name,
            price=item.price,
            quantity=item.quantity,
            image=item.image
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item


# Get all cart items for a user
def get_cart_items(db: Session, user_id: str):
    return db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()

# Clear cart after order placement
def clear_cart(db: Session, user_id: str):
    db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()
    db.commit()

# Create order and order items from cart
def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(user_id=order.user_id)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            price=item.price,
            quantity=item.quantity,
            image=item.image
        )
        db.add(db_item)

    db.commit()
    clear_cart(db, order.user_id)
    return db_order

def create_order_from_cart(db: Session, order: schemas.OrderCreate):
    # Create and add the order (but don't commit yet)
    new_order = models.Order(user_id=order.user_id)
    db.add(new_order)
    db.flush()  # Makes new_order.id available without committing

    # Add all order items
    for item in order.items:
        if not item.product_name:
            raise HTTPException(status_code=400, detail="Missing product_name in item")

        db_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            price=item.price,
            quantity=item.quantity,
            image=item.image
        )
        db.add(db_item)

    # Clear cart after placing the order
    db.query(models.CartItem).filter(models.CartItem.user_id == order.user_id).delete()

    # Commit once — includes order, items, and cart clear
    db.commit()
    db.refresh(new_order)

    return new_order
