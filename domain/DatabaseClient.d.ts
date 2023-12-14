import { SanityClient } from '@sanity/client';

export type RefDocument = { 
    _type: "reference",
    _ref: string
};

export default class DatabaseClient {
    client: SanityClient;
    constructor(client: SanityClient);
    update<Doc>(doc_id: string,new_doc : Doc) : Promise<Doc>;
    get<Params, Doc>(query: string,params: Params) : Promise<Doc>;
    add<Doc>(_type: string,doc: Doc) : Promise<Doc>;
    delete(doc_id: string) : Promise<void>;
    deleteByQuery<Params>(query: string,params: Params) : Promise<void>;
    uploadAsset(data: Buffer,filename: string,doc_id: string,property_name: string) : Promise<Asset>;
}