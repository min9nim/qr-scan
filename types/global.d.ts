import { ILogger } from 'if-logger'

declare global {
  interface Window {
    $logger: ILogger
  }
}
