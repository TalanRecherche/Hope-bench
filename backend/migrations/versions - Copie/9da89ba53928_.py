"""empty message

Revision ID: 9da89ba53928
Revises: 2f2e938d964d, 3d2a97c31d61
Create Date: 2024-03-12 21:35:15.733993

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9da89ba53928'
down_revision: Union[str, None] = ('2f2e938d964d', '3d2a97c31d61')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
