import bcrypt from "bcrypt";

export function hash(input) {
	return bcrypt.hash(input, 10);
}

export function compare(input, hash) {
	return bcrypt.compare(input, hash);
}
