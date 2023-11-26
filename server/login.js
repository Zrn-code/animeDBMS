export const findByEmail = async (email) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new Error('can not find user by email');
    }
  };
  

  export const checkPassword = async (password, hashedPassword) => {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('can not check password');
    }
  };