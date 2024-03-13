import { Comment /* CommentReply */ } from '../../../types/commentTypes';
import pic from '../../../assets/dummyPhotos/monke.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Box, Button, Divider, IconButton, Input, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
// import { ChatBubbleOutline, KeyboardArrowDown } from '@mui/icons-material';
import { getComments, postComment } from '@api/comments.ts';
import useAuth from '@context/AuthProvider';
import useSnackBar from '@context/SnackBarProvider';

/**
 * This is the comments section of a specific recipe's page.
 * This component handles the fetching and displaying of any comments related to the recipe
 */
export default function CommentSection({ recipeId }: { recipeId: string }) {
  const [commentDraft, setCommentDraft] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showControls, setShowControls] = useState(false);
  const { user } = useAuth();
  const { addSnack } = useSnackBar();

  // Fetch the comments on load up
  useEffect(() => {
    getComments(recipeId).then(newComments => {
      setComments(newComments);
    });
  }, [recipeId]);
  const commentCount = comments?.length;

  // Handles the submission of a comment
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      addSnack('You must be logged in to comment', 'error');
      return;
    }

    postComment(recipeId, commentDraft, user.uid).then(success => {
      // If the comment was successfully posted, fetch the comments again to update the comments list
      if (success) {
        getComments(recipeId).then(newComments => {
          setComments(newComments);
          setCommentDraft('');
          setShowControls(false);
        });
        addSnack('Comment posted', 'success');
      }
    });
  };

  return (
    <Box>
      {/* Comments header */}
      <Typography variant={'h4'} color={'text'}>
        {commentCount} Comment{(commentCount > 1 || commentCount == 0) && 's'}
      </Typography>
      <Divider variant={'fullWidth'} sx={{ my: 1, mb: 3 }} />
      {/* Comment input */}
      <Box display={'flex'} flexDirection={'column'} mb={4} gap={2}>
        <form method="post" onSubmit={e => handleFormSubmit(e)}>
          <Box display={'flex'} gap={2}>
            <Avatar src={pic} alt="User Avatar" />
            <Input
              type={'text'}
              placeholder={'Add a comment...'}
              color={'secondary'}
              onFocus={() => setShowControls(true)}
              value={commentDraft}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommentDraft(e.target.value)}
              sx={{ width: '100%' }}
              multiline
            />
          </Box>
          {/* Comment controls (cancel, comment) */}
          {showControls && (
            <Box display={'flex'} gap={2} justifyContent={'flex-end'}>
              <Button variant={'text'} color={'secondary'} onClick={() => setShowControls(false)}>
                Cancel
              </Button>
              <Button variant={'text'} color={'secondary'} disabled={commentDraft.length === 0} type="submit">
                Comment
              </Button>
            </Box>
          )}
        </form>
      </Box>
      {/* List of comments from each user */}
      <Stack spacing={3}>
        {/* Comment component. Contains the comment and its replies*/}
        {comments?.map(comment => <CommentComponent {...comment} key={comment.id} />)}
      </Stack>
    </Box>
  );
}

function CommentComponent(props: Comment) {
  // const [repliesOpen, setRepliesOpen] = useState(false);
  // const [replying, setIsReplying] = useState(false);
  // const replyCount = props.replies.length;
  // TODO: Search message for any @s of other people and turn them into links
  return (
    <>
      <Box display={'flex'} ml={5} gap={2}>
        <Avatar src={pic} alt={'Modglio'} />
        {/* Comment body */}
        <Box>
          <Typography color={'text'} variant={'h6'}>
            {props.userId}
          </Typography>
          <Typography color={'text'} variant={'body1'}>
            {props.commentBody}
          </Typography>
          {/* Like and Reply Bar */}
          <Box display={'flex'} gap={1} mt={1}>
            <IconButton sx={{ borderRadius: 4, gap: 0.5 }}>
              <FavoriteBorderIcon color={'secondary'} />
              {/* <Typography color={'text'}>{!props.likeCount && '0'}</Typography> */}
            </IconButton>
            {/* <IconButton sx={{ borderRadius: 4, gap: 0.5 }} onClick={() => setIsReplying(!replying)}>
              <ChatBubbleOutline color={'secondary'} aria-label={'reply'} />
              <Typography variant={'body2'} color={'text'}>
                Reply
              </Typography>
            </IconButton> */}
          </Box>
          {/* Reply input */}
          {/*   {replying && (
            <Box display={'flex'} flexDirection={'column'} ml={1} mt={1} gap={2}>
              <Box display={'flex'} gap={2}>
                <Avatar src={pic} alt={'Moglio'} />
                <Input type={'text'} placeholder={'Add a reply...'} color={'secondary'} sx={{ width: '100%' }} multiline />
              </Box>
              {/* Reply controls (cancel, reply) */}
          {/* 
              <Box display={'flex'} gap={2} justifyContent={'flex-end'} sx={{ width: '100%' }}>
                <Button variant={'text'} color={'secondary'} onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button variant={'text'} color={'secondary'}>
                  Reply
                </Button>
              </Box>
            </Box>
          )} */}
          {/* Replies */}
          {/* {replyCount > 0 && (
            <>
              <IconButton size={'small'} color={'secondary'} onClick={() => setRepliesOpen(!repliesOpen)} sx={{ mb: 1, mt: 1, borderRadius: 4 }}>
                <KeyboardArrowDown />
                <Typography color={'text'}>
                  {replyCount} {replyCount > 1 ? 'replies' : 'reply'}
                </Typography>
              </IconButton>
              {repliesOpen && (
                <Stack my={1} gap={2}>
                  {props.replies.map((reply: CommentReply) => (
                    <CommentReplyComponent {...reply} key={reply.id} />
                  ))}
                </Stack>
              )}
            </>
          )} */}
        </Box>
      </Box>
    </>
  );
}

// function CommentReplyComponent(props: CommentReply) {
//   return (
//     <Box display={'flex'} ml={1} gap={2}>
//       <Avatar src={pic} alt={'Moglio'} />
//       <Box>
//         {/* Comment body */}
//         <Typography color={'text'} variant={'h6'}>
//           {props.username}
//         </Typography>
//         <Typography color={'text'} variant={'body1'}>
//           {props.message}
//         </Typography>
//         {/*  Like and Reply Bar*/}
//         <Box display={'flex'} gap={1} mt={1}>
//           <IconButton sx={{ borderRadius: 4, gap: 0.5 }}>
//             <FavoriteBorderIcon color={'secondary'} />
//             <Typography color={'text'}>{props.likeCount}</Typography>
//           </IconButton>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
