import { RuntimeError } from '@distributedlab/tools'
import { errors } from '@distributedlab/w3p'
import log from 'loglevel'

import { bus, BUS_EVENTS } from '@/helpers'
import i18n from '@/localization'

enum VERIFIER_INTERNAL_ERRORS {
  conflictAddressesIdentity = `execution reverted: DemoVerifier: current address has already been used to verify another identity`,
  emptyState = `execution reverted: QueryMTPValidatorOffChain: state doesn't exist in state contract`,
}

export class ErrorHandler {
  static process(error: Error | unknown, errorMessage = ''): void {
    const { msgTranslation, msgType } = ErrorHandler._getErrorMessage(error)
    bus.emit(msgType as BUS_EVENTS, msgTranslation || errorMessage)

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: Error | unknown): void {
    log.error(error)
  }

  static _getErrorMessage(error: Error | unknown): {
    msgTranslation: string
    msgType: 'error' | 'warning'
  } {
    let errorMessage = ''
    let msgType: 'error' | 'warning' = 'error'

    if (error instanceof Error) {
      switch (error.constructor) {
        default: {
          if ('error' in error) {
            const currentError = error.error as RuntimeError

            switch (error?.error?.constructor) {
              case errors.ProviderInternalError:
                if (
                  currentError?.message ===
                  VERIFIER_INTERNAL_ERRORS.conflictAddressesIdentity
                ) {
                  errorMessage = i18n.t(
                    'verifier-errors.conflict-addresses-identity',
                  )
                  msgType = 'warning'
                } else if (
                  currentError?.message === VERIFIER_INTERNAL_ERRORS.emptyState
                ) {
                  errorMessage = i18n.t('verifier-errors.empty-state')
                  msgType = 'warning'
                }
                break
              default:
                errorMessage = i18n.t('errors.default')
            }
          }
        }
      }
    }

    return {
      msgTranslation: errorMessage,
      msgType: msgType || 'error',
    }
  }
}
