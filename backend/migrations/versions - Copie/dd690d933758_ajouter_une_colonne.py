"""Ajouter une colonne

Revision ID: dd690d933758
Revises: 637b8abecdec
Create Date: 2024-03-26 17:56:03.852391

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd690d933758'
down_revision: Union[str, None] = '637b8abecdec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
