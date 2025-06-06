"""Initial clean setup

Revision ID: 635cbcac7446
Revises: 28ad91e26a2f
Create Date: 2025-05-30 12:56:32.444413

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '635cbcac7446'
down_revision: Union[str, None] = '28ad91e26a2f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cart_items', sa.Column('image', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cart_items', 'image')
    # ### end Alembic commands ###
