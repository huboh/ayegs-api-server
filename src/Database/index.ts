import * as api from './api';
import mongoose, { Connection } from 'mongoose';

interface ConnectProps {
  host: string;
  onOpen?(): void;
  onClose?(): void;
  onError?(): void;
}

export default class DataBase {
  // * models api
  public User = api.User;
  public Product = api.Product;

  private connection: Connection = mongoose.connection;
  private static _singletonInstance: DataBase;

  constructor() {
    return DataBase._singletonInstance ?? (DataBase._singletonInstance = this);
  }

  async connect(props: ConnectProps) {
    this.connection.on('open', () => props.onOpen?.());
    this.connection.on('close', () => props.onClose?.());
    this.connection.on('error', () => props.onError?.());
    return mongoose.connect(props.host);
  }

  async close() {
    return this.connection.close();
  }
}