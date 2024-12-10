import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enables debugging information in logs
  providers: [
    CredentialsProvider({
      name: "User Credentials", // User login provider
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error("No credentials provided");
          return null;
        }

        try {
          const res = await axios.post(
            "http://localhost:8000/auth/login", // Your API endpoint for login
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (res && res.status === 200) {
            const user = {
              id: res.data.user.id,
              firstName: res.data.user.firstName,
              lastName: res.data.user.lastName,
              role: res.data.user.role,
              email: res.data.user.email,
              subscription: {
                type: res.data.user.subscription.type,
                start_date: res.data.user.subscription.start_date,
                end_date: res.data.user.subscription.end_date,
              },
              jwt: res.data.token,
            };
            console.log("Logged in user:", user);
            return user;
          }
        } catch (error) {
          console.error("Error during user authorization:", error);
        }

        return null;
      },
    }),
    CredentialsProvider({
      id: "staff-credentials", // Staff login provider
      name: "Staff Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error("No staff credentials provided");
          return null;
        }

        try {
          const res = await axios.post(
            "http://localhost:8000/auth/staff/login", 
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (res && res.status === 200) {
            const user = {
              id: res.data.user.id,
              firstName: res.data.user.firstName,
              lastName: res.data.user.lastName,
              role: res.data.user.role,
              email: res.data.user.email,
              jwt: res.data.token,
            };

            // Check if the role is 'staff', otherwise reject
            if (user.role !== "staff") {
              console.error("Unauthorized role for staff login");
              return null; // Reject non-staff users
            }

            if(user.email.includes("AC"))
            {
              user.role = "accountant";
            }
            else if(user.email.includes("PM"))
            {
              user.role = "purchase_manager";
            } else if (user.email.includes("AM"))
            {
              user.role = "admin";
            }

            console.log("Logged in staff:", user);
            return user;
          }
        } catch (error) {
          console.error("Error during staff authorization:", error);
        }

        return null;
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.jwt = user.jwt; // Store JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          email: token.email,
          role: token.role,
        };
        session.jwt = token.jwt; // Store JWT in session
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 60, // 30 minutes
  },
  pages: {
    signIn: "/login", 
  },
};

export default NextAuth(authOptions);
