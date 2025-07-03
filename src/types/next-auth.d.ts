declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      subscription: {
        plan: string;
        status: string;
        currentPeriodEnd?: Date;
      };
    };
  }

  interface User {
    _id: unknown;
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    subscription: {
      plan: string;
      status: string;
      currentPeriodEnd?: Date;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    subscription: {
      plan: string;
      status: string;
      currentPeriodEnd?: Date;
    };
  }
}
