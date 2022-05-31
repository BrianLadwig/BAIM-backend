import mongoose from "mongoose";

const { Schema, model } = mongoose;

const required = true;
const trim = true;
const unique = true;

const AddressesSchema = new Schema(
	{
		street: { type: String, trim },
		city: { type: String, required, trim },
		zip: { type: String, trim },
		country: { type: String, required, trim },
	},
	{
		_id: false,
	}
);

const UserSchema = new Schema(
	{
		firstName: { type: String, required, trim },
		lastName: { type: String, required, trim },

		profileName: { type: String, required, unique, trim },
		profilePicture: { type: String, trim },

		email: { type: String, trim, unique, required },
		password: { type: String, required },

		userAddress: { type: AddressesSchema, required },

		beauty: { type: [Schema.Types.ObjectId], ref: "beauty" },
		recipe: { type: [Schema.Types.ObjectId], ref: "recipe" },
		diy: { type: [Schema.Types.ObjectId], ref: "diy" },
		garden: { type: [Schema.Types.ObjectId], ref: "garden" },
		event: { type: [Schema.Types.ObjectId], ref: "event"}
		// subs: { type: [Schema.Types.ObjectId], ref: "subs" },

		// collection: { type: [Schema.Types.ObjectId], ref: "collection" },

		// followers: { type: [Schema.Types.ObjectId], ref: "followers" },
		// dmMessages: { type: [Schema.Types.ObjectId], ref: "dmMessages" },
	},
	{
		timestamps: true,
	}
);

const User = model("user", UserSchema);

export default User;