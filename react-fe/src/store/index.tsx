import { FC, ReactNode } from "react";

import { UserProvider } from "../modules/auth/store";

const StoreProvider: FC<{children: ReactNode}> = ({ children }) => {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
}

export default StoreProvider;