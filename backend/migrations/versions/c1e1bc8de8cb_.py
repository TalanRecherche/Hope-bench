"""empty message

Revision ID: c1e1bc8de8cb
Revises: b59868689419
Create Date: 2024-08-29 15:42:01.509245

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1e1bc8de8cb'
down_revision: Union[str, None] = 'b59868689419'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass