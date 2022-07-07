import mongoose from "mongoose";


const { Schema, model } = mongoose;

const required = true;
const trim = true;
const unique = true;

const AddressesSchema = new Schema(
  {
    street: { type: String, trim },
    streetNumber: { type: String, trim },
    city: { type: String, required, trim },
    zip: { type: String, trim },
    country: { type: String, required, trim },
  },
  {
    _id: false,
  }
);

const PinSchema = new Schema({
  postId:   { type: Schema.Types.ObjectId, required },
  postType: { type: String, required   }
},{ _id: false,})

const UserSchema = new Schema(
  {
    firstName: { type: String, required, trim },
    lastName:  { type: String, required, trim },

    profileName: { type: String, required, unique, trim },
    avatar: {
      type: String,
      trim,
      default: `https://avatars.dicebear.com/api/croodles-neutral/${Math.floor(
        Math.random() * 999
      )}.svg`,
    },

    email:    { type: String, required, unique, trim },
    password: { type: String, required },

    userAddress: { type: AddressesSchema, required },
	  status: 	 { type: String, trim},

    interests: {
      type: [String],
      trim,
      enum: ["arts-and-craft", "beauty", "event", "garden", "recipe"],
    },
    beauty:     { type: [Schema.Types.ObjectId], ref: "beauty" },
    recipe:     { type: [Schema.Types.ObjectId], ref: "recipe" },
    artsCraft:  { type: [Schema.Types.ObjectId], ref: "artsCraft" },
    garden:     { type: [Schema.Types.ObjectId], ref: "garden" },
    event:      { type: [Schema.Types.ObjectId], ref: "event" },
    pin:        { type: [PinSchema], default:[] },
    followers:  { type: [Schema.Types.ObjectId], ref: "followers" },
    following:  { type: [Schema.Types.ObjectId], ref: "following" },
    confirmed:  { type: Boolean, required, default: false }
    // If we need dmMessages: { type: [Schema.Types.ObjectId], ref: "dmMessages" },
    // If we need the user/comment reference. Maybe
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("remove", async function () {

  console.log("remove");

  for ( let i = 0; i < this.following.length; i++) {

    let followedUser = await User.findById(this.following[i]);

	if(followedUser){
		 followedUser.followers = followedUser.followers.filter(
      (x) => x.toString() !== this._id.toString()
    );
    await followedUser.save();
	}
  }



  for ( let i = 0; i < this.followers.length; i++) {

    let followingUser = await User.findById(this.followers[i]);

	if(followingUser){
		followingUser.following = followingUser.following.filter(
      (x) => x.toString() !== this._id.toString()
    );
    await followingUser.save();
	}  
  }
});

const User = model("user", UserSchema);

export default User;
