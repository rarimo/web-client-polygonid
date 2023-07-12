import { ClaimTypes } from '@/contexts/ZkpContext/enums'

export const CLAIM_TYPES_MAP: Record<ClaimTypes, unknown> = {
  [ClaimTypes.KYCAgeCredential]: {
    id: 1,
    circuitId: 'credentialAtomicQueryMTPV2',
    query: {
      allowedIssuers: ['*'],
      context:
        'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
      credentialSubject: {
        birthday: {
          $lt: 20020101,
        },
      },
      type: 'KYCAgeCredential',
    },
  },
}
