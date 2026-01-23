import { Injectable, OnModuleInit } from '@nestjs/common';


@Injectable()
export class VaultService implements OnModuleInit {
  private VAULT_URL ='http://localhost:8200';
  private VAULT_TOKEN ='root';

    async onModuleInit() {
        // Initialize Vault connection here
        console.log('VaultService initialized');
    }
    
    async getSecret(path: string): Promise<any> {
        try {
            const response = await fetch(`${this.VAULT_URL}/v1/secret/data/${path}`, {
                headers: {
                    'X-Vault-Token': this.VAULT_TOKEN,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch secret from Vault');
            }
            const data = await response.json();
            return data.data.data; // Adjust based on your Vault secret structure
        } catch (error) {
            throw new Error('Vault service is unavailable');
        }
    }
}   