import DatabaseClient from "../../domain/DatabaseClient";
import { SanityClient, SanityDocumentStub } from '@sanity/client';

export default class DBClient implements DatabaseClient {
    client: SanityClient;
    constructor(client : SanityClient){
        this.client = client;
    }
    
    async update<Doc>(doc_id: string, new_doc: Doc) : Promise<Doc> {
        return await this.client.patch(doc_id).set(new_doc).commit();
    }

    async get<Params, Doc>(query: string, params: Params) : Promise<Doc> {
        return await this.client.fetch(query, params);
    }

    async add<Doc>(_type: string,doc: Doc): Promise<Doc> {
        let _doc : SanityDocumentStub<Doc> = { _type, ...doc };
        return await this.client.create(_doc);
    }

    async delete(doc_id: string) : Promise<void> {
        await this.client.delete(doc_id);
    }

    async deleteByQuery<Params>(query: string, params: Params): Promise<void> {
        // @ts-ignore
        await this.client.delete({ query, params });
    }

    async uploadAsset(data: Buffer,filename: string,doc_id: string,property_name: string): Promise<Asset> {
        let imageAsset = await this.client.assets.upload('image', data,{ filename });
        
        await this.client.patch(doc_id).set({
            [property_name]: {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: imageAsset._id
                }
            }
        }).commit();

        return imageAsset;
    }
}