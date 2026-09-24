import { observer } from "mobx-react-lite";
import { ReactElement, useEffect } from "react";
import { useStores } from "models";
import { routes } from "routes";
import { useLocation, useNavigate } from "react-router";

export enum Role {
  User,
  Public,
}

export const RequiredAuthentication = observer(({ children, role }: { children: ReactElement; role: Role }) => {
  const { userStore } = useStores();
  const navigate = useNavigate();
  const location = useLocation();

  // check & login if not logged in, sending the user back to where they were once they do
  useEffect(() => {
    userStore.isLoggedIn().then((isLoggedIn) => {
      if (!isLoggedIn) {
        routes.login.path({ queryArgs: { next: `${location.pathname}${location.search}` } }).open(navigate);
      }
    });
  }, [userStore, navigate, location.pathname, location.search]);

  return children;
});
