const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20');
const User=require('../modal/UserOauth2');
passport.use(new GoogleStrategy(
    {
      clientID:
        "815611101262-bi6niv5b1ta6ogqifhstetioghs3bco6.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/google/callback",
    },
    async(accessTocken,refreshTocken,profile,done)=>{
       const newUser={
        googleId:profile.id,
        firstName:profile.name.givenName,
        lastName:profile.name.lastName,
        displayName:profile.displayName,
        email:profile.emails[0].value,
        image:profile.photos[0].value
       };

       try{
         let user=await User.findOne({
            googleId:profile.id
         });
        if(user){
            console.log('use Exist');
            done(null,user);
        }else{
            user=await User.create(newUser);
            console.log(user);
            done(null,user);
        }
       }catch(err){
        console.log("code enter in this block", err);
        done(err,null);
       }

    }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});