const passport = require("passport");

class googleAuth{
    static GoogleAuth =  (req,res) => {
      return passport.authenticate("google", {
        scope: ["profile", "email"],
    })(req, res);
      };
      
      static GoogleCallback = (req, res) => {
         return passport.authenticate("google", {
          failureRedirect: "/",
        })(req, res, () => {
          res.redirect("/");
        });
      };
      
      static Logout = (req, res) => {
        return req.logout(() => {
          res.redirect("/");
        });
      };
}

module.exports=googleAuth;