/**
 * Created by NX on 2019/8/25.
 */
import { Socket, createSocket } from 'dgram';
import {ProxyEventEmitter} from "./proxy-event-emitter";

export const createSocketClient = (host: string, port: number): ProxyUdpSocket => {
  return new ProxyUdpSocket(host, port);
};

export class ProxyUdpSocket extends ProxyEventEmitter {
  private socket: Socket = this.source as Socket;
  constructor(public host: string, public port: number) {
    super(createSocket("udp4"));
    this.associatedListener(['connect', 'error'], true);
  };

  write(buffer: Buffer | Buffer[]) {
    this.socket.send(buffer, this.port, this.host, (error: Error) => {
      if (error) {
        this.emitAsync('error', error);
        this.socket.close();
        this.source = this.socket = createSocket('udp4');
      }
    });
  }
}
