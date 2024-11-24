import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios";

export const authOptions: AuthOptions = {
  debug: true, // Enables debugging information in logs
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
            "http://localhost:8000/auth/login",
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
            // Construct user object based on response data
            const user = {
              id: res.data.user.id,
              firstName: res.data.user.firstName,
              lastName: res.data.user.lastName,
              role: res.data.user.role,
              subscription: {
                type: res.data.user.subscription.type,
                start_date: res.data.user.subscription.start_date,
                end_date: res.data.user.subscription.end_date,
              },
              jwt: res.data.token, // Store the JWT for session management
            };
            console.log("Logged in user:", user);
            return user; // Return user object to NextAuth
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              console.warn("Unauthorized: Invalid credentials");
              return null; // Invalid credentials
            }
            console.error(
              "Error during authorization:",
              error.response?.data || error.message
            );
          } else {
            console.error("Unexpected error:", error);
          }
        }

        return null; // Return null if login fails for any reason
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.role = user.role;
        token.jwt = user.jwt; // Include the JWT in the token for persistence
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
        session.jwt = token.jwt; // Include JWT in session data
      }
      return session;
    }
    
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  jwt: {
    maxAge: 30 * 60, // 30 minutes
  },
  pages: {
    signIn: "/login",
  },
};

// Export the NextAuth handler as the default export
export default NextAuth(authOptions);
