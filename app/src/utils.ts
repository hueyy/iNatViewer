export const getOriginalPhoto = (largePhotoUrl: string): string => {
  return largePhotoUrl.replace(/large(\.jpe?g)%/, "original$1")
}
