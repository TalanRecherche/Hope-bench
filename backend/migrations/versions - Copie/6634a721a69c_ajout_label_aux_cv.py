"""Ajout label aux CV

Revision ID: 6634a721a69c
Revises: 2574fc55b253
Create Date: 2024-04-08 08:48:14.658603

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6634a721a69c'
down_revision: Union[str, None] = '2574fc55b253'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
