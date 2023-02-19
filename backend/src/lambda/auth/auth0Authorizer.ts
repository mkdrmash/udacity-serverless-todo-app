import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used - [done]
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = `-----BEGIN CERTIFICATE-----
MIIDBTCCAe2gAwIBAgIJQfuyu0wTgr8iMA0GCSqGSIb3DQEBCwUAMCAxHjAcBgNV
BAMTFW1rZHJtYXNoLnVzLmF1dGgwLmNvbTAeFw0yMzAyMTgxNjUwMzhaFw0zNjEw
MjcxNjUwMzhaMCAxHjAcBgNVBAMTFW1rZHJtYXNoLnVzLmF1dGgwLmNvbTCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALd5E+rOf7Kr2vf2liHbd3KO3eZz
XLO1GilaTZMRV+wm/ZvliUmTBi5Uz06tStRtDYZto+p+A9LzvOtbktoPy4AE5wT8
itfnNHRlkEavRcZL3xeWe2UnEXfxt5E4zWSIcwH18bZQLE4IY1L/12TNdtJQk799
Dd3XEPFemsNAPe/ezwA7T3EQHekPNoW4b8gPAied5uzAKRdTBW+HXOBXV3DcIcAf
9PjfuQ87ibpx1c6B37psfwxP6IHSu9hjSJo57shuwfHPatYwxJoaWSkPGFTddn5n
YYMdbSsStHVjg/VKUtTNzHi7hwuBJvqGOyd3Q5ZHd1NErU3gXYQUJQFbhhkCAwEA
AaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUCpIioVi08kRuYyjL7O8x
w6G/xyIwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAL7iaVmV1B
Yedr+rnqQTyy/cNUqAtd+n6jyeLJAbqPfkbVxardMBLUFCxhLchXEKwhGaLF3cJX
h24cD3OT7HOCq5Yy3Xc/9Z0V7zLwjZd0H9QXkPm1rLV8q1ssCfztWp+V175Fx0tr
9dLUAWgvmKglxnzhyDi+vLwuOgJ8bZ+yMLobpO+JsZLhtQtoQ+NBoB4Uj78jhblj
w6LV8Uz88EwYkL4G8rJ8RsNx2L11I0SFI71y05oy+egxSAyKwHnC2fBF6lSdc7Aq
Zbqpn1KkePIX5aeZ9f35XBkeAZXmwWHsCNb4h1YA+g6Y9Is3WBN0OkcU1cNXVDC+
/V/RqkXQqR/Q
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification - [done]
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, jwksUrl, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
