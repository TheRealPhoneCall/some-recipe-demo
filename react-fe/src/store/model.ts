import { Dispatch } from "react";

export interface IReducers {
  state: any;
  action: { type: string, payload: any};
}

export interface IActions {
  dispatch: Dispatch<any>;
}