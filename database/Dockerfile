FROM postgres:15-alpine

ENV POSTGRES_DB=concesionaria \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=postgres

COPY migrations/*.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
