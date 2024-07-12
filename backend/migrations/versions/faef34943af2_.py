"""empty message

Revision ID: faef34943af2
Revises: a699eff88f35
Create Date: 2024-07-12 09:57:31.906509

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'faef34943af2'
down_revision: Union[str, None] = 'a699eff88f35'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
