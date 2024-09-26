from ..repositories.OptionsRepository import OptionsRepository
from ..models.Options import *

class OptionsService:
    def __init__(self, options_repository: OptionsRepository):
        self.options_repository = options_repository

    def find_computer(self, computer_id) -> Computer | None:
        return self.options_repository.find_computer(computer_id)

    def find_all_computers(self) -> [Computer]:
        return self.options_repository.find_all_computers()

    def find_phone(self, phone_id) -> Phone | None:
        return self.options_repository.find_phone(phone_id)

    def find_all_phones(self) -> [Phone]:
        return self.options_repository.find_all_phones()

    def find_transport(self, transport_id) -> Transport | None:
        return self.options_repository.find_transport(transport_id)

    def find_all_transports(self) -> [Transport]:
        return self.options_repository.find_all_transports()

    def find_compute_provider(self, compute_provider_id) -> ComputeProvider | None:
        return self.options_repository.find_compute_provider(compute_provider_id)

    def find_all_compute_providers(self) -> [ComputeProvider]:
        return self.options_repository.find_all_compute_providers()

    def find_all_by_name_compute_provider(self, name: str) -> [ComputeProvider]:
        return self.options_repository.find_all_by_name_compute_providers(name)

    def find_storage_provider(self, storage_provider_id) -> StorageProvider | None:
        return self.options_repository.find_storage_provider(storage_provider_id)

    def find_all_storage_providers(self) -> [StorageProvider]:
        return self.options_repository.find_all_storage_providers()

    def find_all_by_name_storage_provider(self, name: str) -> [StorageProvider]:
        return self.options_repository.find_all_by_name_storage_providers(name)

    def find_gpu(self, gpu_id) -> GPU | None:
        return self.options_repository.find_gpu(gpu_id)

    def find_all_gpus(self) -> [GPU]:
        return self.options_repository.find_all_gpus()
