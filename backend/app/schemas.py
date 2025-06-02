from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    userid: str
    password: str
    role: str

# Used internally for authentication context
class User(BaseModel):
    userid: str
    role: str

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    userid: str
    password: str

class ProductBase(BaseModel):
    name: str
    price: int
    inventory: int
    image: Optional[str] = None
    description: Optional[str] = None


class ProductCreate(ProductBase):
    pass  # No extra fields required


class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True  # Required to work with SQLAlchemy models


class CartItemCreate(BaseModel):
    product_id: int  # changed from str to int to match FK in DB
    product_name: str
    price: float
    quantity: int
    image: str

class CartItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    price: float
    quantity: int
    image: Optional[str]

    class Config:
        orm_mode = True

class OrderItemOut(BaseModel):
    product_name: str
    price: float
    quantity: int

class OrderCreate(BaseModel):
    user_id: str
    items: List[CartItemCreate]

class OrderOut(BaseModel):
    id: int
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True  # for ORM mode compatibility in Pydantic v2