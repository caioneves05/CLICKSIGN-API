import { Axios, AxiosResponse } from "axios";
import qs from 'querystring'

import { Request, Response } from "./types";
import { clientBody } from "./createClientBody";
import { validationKeyEnviroment } from "./keyValidation";


export interface ClickSignClient {
    client: Axios
    key: string
    createDocument: (request: Request.createDocument,) => Promise<Response.createDocument>
    createSigner: (request: Request.createSigner,) => Promise<Response.createSigner>
}

export class ClickSign implements ClickSignClient {
    client: Axios
    key: string

    constructor(client: Axios, key: string){
        if(!key) {
            throw new Error('Parameter token is not set.')
        }
        this.client = client
        this.key = key
    }

    private errorResponse = (response: AxiosResponse) => {
      if(response.data.errors) {
          console.error(response.data.errors)
          throw new Error()
      }
    }

    async createDocument(request: Request.createDocument) {
        const { client, key } = this
        const config = qs.stringify({access_token: key})

        const result = await client.post(`/api/v1/documents?${config}`, request)
        this.errorResponse(result)
        return await result.data
    }

    async createSigner(request: Request.createSigner) {
      const { client, key } = this
      const config = qs.stringify({access_token: key})

      const result = await client.post(`/api/v1/signers?${config}`, request)
      return await result.data
    }
}

