/**
 * Creates a new user entry in Firebase Realtime Database.
 *
 * @async
 * @function addNewUser
 * @param {{name: string, email: string, password: string}} newUser - User data to persist.
 * @returns {Promise<void>} Resolves when the user has been stored.
 */
async function addNewUser(newUser) {
  try {
    const usersRef = firebase.database().ref("users");
    const newUserRef = usersRef.push();
    await newUserRef.set({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    });
    // return newUserRef; if i want to use it later
  } catch (error) {
    console.error("Error registering user:", error);
  }
}


/**
 * Checks whether a username already exists in Firebase Realtime Database.
 *
 * @async
 * @function isUserNameTaken
 * @param {string} userName - Username to validate.
 * @returns {Promise<boolean>} True if the username exists, otherwise false.
 */
async function isUserNameTaken(userName) {
  try {
    const usersRef = firebase.database().ref("users");

    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    if (!users) return false;

    for (let key in users) {
      if (users[key].name === userName) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
}


/**
 * Checks whether an email address already exists in Firebase Realtime Database.
 *
 * @async
 * @function isUserEmailTaken
 * @param {string} inputEmail - Email address to validate.
 * @returns {Promise<boolean>} True if the email exists, otherwise false.
 */
async function isUserEmailTaken(inputEmail) {
  try {
    const usersRef = firebase.database().ref("users");

    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    if (!users) return false;

    for (let key in users) {
      if (users[key].email === inputEmail) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking user Email:", error);
    return false;
  }
}
