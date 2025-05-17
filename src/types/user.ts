export type User = {
  uid: string;
  email: string;
  username: string;
};

type BaseUser = Pick<User, "uid" | "email">;
type PartialUserFields = Partial<Omit<User, "uid" | "email">>;

export type UserState = BaseUser & PartialUserFields;

export type UserRegistration = Omit<User, "uid">;
