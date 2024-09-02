"""empty message

Revision ID: ac4bab9bbe89
Revises: cbf4515ab219
Create Date: 2024-08-29 15:42:01.509245

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ac4bab9bbe89'
down_revision: Union[str, None] = 'cbf4515ab219'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass