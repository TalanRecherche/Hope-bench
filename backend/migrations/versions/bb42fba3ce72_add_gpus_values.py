"""Add GPUs values

Revision ID: bb42fba3ce72
Revises: 6dd98569d680
Create Date: 2024-09-26 17:32:28.365902

"""
from typing import Sequence, Union
from uuid import uuid4

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bb42fba3ce72'
down_revision: Union[str, None] = '6dd98569d680'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    gpu = [{"id":"985","name":"A100 PCIe 40\/80GB"},{"id":"986","name":"A100 SXM4 80 GB"},{"id":"987","name":"AGX Xavier"},{"id":"1022","name":"AMD EPYC 7763"},{"id":"988","name":"AMD RX480"},{"id":"990","name":"GTX 1080"},{"id":"989","name":"GTX 1080 Ti"},{"id":"991","name":"GTX 750"},{"id":"992","name":"GTX TITAN X"},{"id":"1018","name":"Intel Xeon E5-2630v4"},{"id":"1019","name":"Intel Xeon E5-2650"},{"id":"1017","name":"Intel Xeon E5-2699"},{"id":"1020","name":"Intel Xeon Gold 5220"},{"id":"1021","name":"Intel Xeon Gold 6148"},{"id":"993","name":"Quadro K6000"},{"id":"994","name":"Quadro P6000"},{"id":"996","name":"RTX 2080"},{"id":"995","name":"RTX 2080 Ti"},{"id":"1013","name":"RTX 3080"},{"id":"1014","name":"RTX 3080 TI"},{"id":"1015","name":"RTX 3090"},{"id":"997","name":"RTX 8000"},{"id":"1016","name":"RTX A6000"},{"id":"998","name":"T4"},{"id":"999","name":"Tesla K40c"},{"id":"1000","name":"Tesla K80"},{"id":"1001","name":"Tesla M40 24GB"},{"id":"1002","name":"Tesla P100"},{"id":"1003","name":"Tesla P40"},{"id":"1004","name":"Tesla V100-PCIE-16GB"},{"id":"1005","name":"Tesla V100-SXM2-16GB"},{"id":"1006","name":"Tesla V100-SXM2-32GB"},{"id":"1007","name":"Titan RTX"},{"id":"1008","name":"Titan V"},{"id":"1009","name":"TITAN X Pascal"},{"id":"1010","name":"Titan Xp"},{"id":"1011","name":"TPUv2 Chip"},{"id":"1012","name":"TPUv3 Chip"}]
    gpu_db = [{"id": uuid4(), "name": gpu["name"]} for gpu in gpu]

    op.bulk_insert(
        sa.table('gpu',
                 sa.Column('id', sa.String(), nullable=False),
                 sa.Column('name', sa.String(), nullable=False),
                 ),
        gpu_db
    )

def downgrade() -> None:
    op.execute("DELETE * FROM gpu")