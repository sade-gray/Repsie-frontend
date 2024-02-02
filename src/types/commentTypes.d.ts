export interface Comment {
  id: number,
  username: string,
  message: string,
  likeCount: number,
  replies: CommentReply[],
}

export interface CommentReply {
  id: number,
  username: string,
  message: string,
  likeCount: number,
}
