export const buildDefaultAvatar = (name = "North Luxe") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=061B3A&color=ffffff&bold=true`;

const appendAvatarVersion = (avatar, version) => {
  if (!avatar || !version || avatar.startsWith("data:")) return avatar;

  const separator = avatar.includes("?") ? "&" : "?";
  return `${avatar}${separator}v=${encodeURIComponent(version)}`;
};

export const getUserAvatar = (user) => {
  const avatar = typeof user?.avatar === "string" ? user.avatar.trim() : "";
  const version =
    user?.avatarUpdatedAt ||
    user?.updatedAt ||
    user?._updatedAt ||
    user?.id ||
    user?._id ||
    "";

  if (avatar) return appendAvatarVersion(avatar, version);
  return buildDefaultAvatar(user?.name || "North Luxe");
};
