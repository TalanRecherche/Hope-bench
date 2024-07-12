"""empty message

Revision ID: b59868689419
Revises: faef34943af2
Create Date: 2024-07-12 15:42:01.509245

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b59868689419'
down_revision: Union[str, None] = 'faef34943af2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
