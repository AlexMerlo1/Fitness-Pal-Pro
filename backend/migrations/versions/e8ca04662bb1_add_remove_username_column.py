"""Add/remove username column

Revision ID: e8ca04662bb1
Revises: 
Create Date: 2024-11-20 14:43:19.516381

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e8ca04662bb1'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Step 1: Create a new table with the desired column structure
    op.create_table(
        'user_new',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),  # NOT NULL constraint
        sa.Column('email', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Step 2: Copy data from the old table to the new table
    op.execute('INSERT INTO user_new (id, username, email) SELECT id, username, email FROM user')

    # Step 3: Drop the old table
    op.drop_table('user')

    # Step 4: Rename the new table to the original table name
    op.rename_table('user_new', 'user')

def downgrade():
    # Similar steps for the downgrade (reverting the changes)
    op.create_table(
        'user_new',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=True),  # Make the column nullable
        sa.Column('email', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.execute('INSERT INTO user_new (id, username, email) SELECT id, username, email FROM user')
    op.drop_table('user')
    op.rename_table('user_new', 'user')
