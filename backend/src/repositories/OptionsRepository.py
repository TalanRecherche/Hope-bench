from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session

from .models import ComputerDB, PhoneDB, TransportDB, ComputeProviderDB, StorageProviderDB
from ..models.Options import Computer, Phone, Transport, ComputeProvider, StorageProvider


class OptionsRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    # Computer
    def find_computer(self, computer_id) -> Computer | None:
        with self.session_factory() as db:
            computer_db = self._find_computer(db, computer_id).one_or_none()
            return self._computer_db_to_domain(computer_db)

    def _find_computer(self, db: Session, computer_id: str):
        return db.query(ComputerDB).filter(ComputerDB.id_computer == computer_id)

    def find_all_computers(self) -> [Computer]:
        with self.session_factory() as db:
            computers_db = self._find_all_computers(db)
            return [self._computer_db_to_domain(computer) for computer in computers_db]

    def _find_all_computers(self, db):
        return db.query(ComputerDB)

    @staticmethod
    def _computer_db_to_domain(computer_db: ComputerDB | None) -> Computer | None:
        if computer_db is None:
            return None
        return Computer(
            id_computer=computer_db.id_computer,
            model=computer_db.model,
        )

    # Phone
    def find_phone(self, phone_id) -> Phone | None:
        with self.session_factory() as db:
            phone_db = self._find_phone(db, phone_id).one_or_none()
            return self._phone_db_to_domain(phone_db)

    def _find_phone(self, db: Session, phone_id: str):
        return db.query(PhoneDB).filter(PhoneDB.id_phone == phone_id)

    def find_all_phones(self) -> [Phone]:
        with self.session_factory() as db:
            phones_db = self._find_all_phones(db)
            return [self._phone_db_to_domain(phone) for phone in phones_db]

    def _find_all_phones(self, db):
        return db.query(PhoneDB)

    @staticmethod
    def _phone_db_to_domain(phone_db: PhoneDB | None) -> Phone | None:
        if phone_db is None:
            return None
        return Phone(
            id_phone=phone_db.id_phone,
            model=phone_db.model,
        )

    # Transport
    def find_transport(self, transport_id) -> Transport | None:
        with self.session_factory() as db:
            transport_db = self._find_transport(db, transport_id).one_or_none()
            return self._transport_db_to_domain(transport_db)

    def _find_transport(self, db: Session, transport_id: str):
        return db.query(TransportDB).filter(TransportDB.id_transport == transport_id)

    def find_all_transports(self) -> [Transport]:
        with self.session_factory() as db:
            transports_db = self._find_all_transports(db)
            return [self._transport_db_to_domain(transport) for transport in transports_db]

    def _find_all_transports(self, db):
        return db.query(TransportDB)

    @staticmethod
    def _transport_db_to_domain(transport_db: TransportDB | None) -> Transport | None:
        if transport_db is None:
            return None
        return Transport(
            id_transport=transport_db.id_transport,
            transport_mode=transport_db.transport_mode,
        )

    # Compute Provider
    def find_compute_provider(self, compute_provider_id) -> ComputeProvider | None:
        with self.session_factory() as db:
            compute_provider_db = self._find_compute_provider(db, compute_provider_id).one_or_none()
            return self._compute_provider_db_to_domain(compute_provider_db)

    def _find_compute_provider(self, db: Session, compute_provider_id: str):
        return db.query(ComputeProviderDB).filter(ComputeProviderDB.id_compute_provider == compute_provider_id)

    def find_all_compute_providers(self) -> [ComputeProvider]:
        with self.session_factory() as db:
            compute_providers_db = self._find_all_compute_providers(db)
            return [self._compute_provider_db_to_domain(compute_provider) for compute_provider in compute_providers_db]

    def _find_all_compute_providers(self, db):
        return db.query(ComputeProviderDB)

    def find_all_by_name_compute_providers(self, name: str) -> [ComputeProvider]:
        with self.session_factory() as db:
            compute_providers_db = self._find_all_by_name_compute_providers(db, name)
            return [self._compute_provider_db_to_domain(compute_provider) for compute_provider in compute_providers_db]

    def _find_all_by_name_compute_providers(self, db, name: str):
        return db.query(ComputeProviderDB).filter(ComputeProviderDB.name == name)

    @staticmethod
    def _compute_provider_db_to_domain(compute_provider_db: ComputeProviderDB | None) -> ComputeProvider | None:
        if compute_provider_db is None:
            return None
        return ComputeProvider(
            id_compute_provider=compute_provider_db.id_compute_provider,
            name=compute_provider_db.name,
            region=compute_provider_db.region,
        )

    # Storage Provider
    def find_storage_provider(self, storage_provider_id) -> StorageProvider | None:
        with self.session_factory() as db:
            storage_provider_db = self._find_storage_provider(db, storage_provider_id).one_or_none()
            return self._storage_provider_db_to_domain(storage_provider_db)

    def _find_storage_provider(self, db: Session, storage_provider_id: str):
        return db.query(StorageProviderDB).filter(StorageProviderDB.id_storage_provider == storage_provider_id)

    def find_all_storage_providers(self) -> [StorageProvider]:
        with self.session_factory() as db:
            storage_providers_db = self._find_all_storage_providers(db)
            return [self._storage_provider_db_to_domain(storage_provider) for storage_provider in storage_providers_db]

    def _find_all_storage_providers(self, db):
        return db.query(StorageProviderDB)

    def find_all_by_name_storage_providers(self, name: str) -> [StorageProvider]:
        with self.session_factory() as db:
            storage_providers_db = self._find_all_by_name_storage_providers(db, name)
            return [self._storage_provider_db_to_domain(storage_provider) for storage_provider in storage_providers_db]

    def _find_all_by_name_storage_providers(self, db, name: str):
        return db.query(StorageProviderDB).filter(StorageProviderDB.name == name)

    @staticmethod
    def _storage_provider_db_to_domain(storage_provider_db: StorageProviderDB | None) -> StorageProvider | None:
        if storage_provider_db is None:
            return None
        return StorageProvider(
            id_storage_provider=storage_provider_db.id_storage_provider,
            name=storage_provider_db.name,
            region=storage_provider_db.region,
        )
