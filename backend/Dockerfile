FROM python:3.10-slim-buster

WORKDIR /app/backend

COPY ./ /app/backend

# needed for psycopg2 install
RUN apt-get update && \
    apt-get install -y libpq-dev gcc

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

# Script launched on startup, used to add configuration to frontend part at runtime, not build
COPY entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
