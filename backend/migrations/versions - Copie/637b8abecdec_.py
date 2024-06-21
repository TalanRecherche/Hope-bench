"""empty message

Revision ID: 637b8abecdec
Revises: 45aa399f79f5, 44e343e3bc63
Create Date: 2024-03-26 17:14:44.432906

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '637b8abecdec'
down_revision: Union[str, None] = ('45aa399f79f5', '44e343e3bc63')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
