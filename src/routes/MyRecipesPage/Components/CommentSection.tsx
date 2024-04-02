import { Comment } from '../../../types/commentTypes';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Box, Button, Container, Divider, Grid, IconButton, Input, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
// import { ChatBubbleOutline, KeyboardArrowDown } from '@mui/icons-material';
import { getComments, postComment } from '@api/comments.ts';
import useAuth from '@context/AuthProvider';
import useSnackBar from '@context/SnackBarProvider';
import CommentOptions from '../../Recipe/components/CommentOptions.tsx';
import { useTheme } from '@mui/material/styles';
import { getUsernameAndNumber } from '@api/user.ts';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      addSnack('You must be logged in to comment', 'error');
      return;
    }
    const newComment: Comment = {
      // Add a temporary id to comment (it gets updated after api call)
      id: 'pendingComment' + Math.random() * 2,
      userId: user.uid,
      commentBody: commentDraft,
    };
    // Optimistically add the new comment
    addComment(newComment);
    setCommentDraft('');
    setShowControls(false);

    // TODO: Update backend api to return the id of the new comment (for optimistic updating)
    const success = await postComment(recipeId, commentDraft, user.uid);
    // If the comment was successfully posted, fetch the comments again to update the comments list
    if (!success) {
      removeComment(newComment.id);
      addSnack('There was a problem posting your comment', 'success');
    } else {
      // re-render the component to include the new comment with the real id
      getComments(recipeId).then(newComments => {
        setComments(newComments);
      });
    }
  };

  const addComment = (newComment: Comment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };

  // Removes a comment from the list of comments
  const removeComment = (id: string) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== id));
  };

  return (
    <Box>
      {/* Comments header */}
      <Typography variant={'h4'}>
        {commentCount} Comment{(commentCount > 1 || commentCount == 0) && 's'}
      </Typography>
      <Divider variant={'fullWidth'} sx={{ my: 1, mb: 3 }} />
      {/* Comment input */}
      <Box display={'flex'} flexDirection={'column'} mb={4} gap={2}>
        <form method="post" onSubmit={e => handleFormSubmit(e)}>
          <Box display={'flex'} gap={2}>
            <Avatar alt="User Avatar" />
            <Input
              type={'text'}
              placeholder={'Add a comment...'}
              color={'primary'}
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
              <Button variant={'text'} color={'primary'} onClick={() => setShowControls(false)}>
                Cancel
              </Button>
              <Button variant={'text'} color={'primary'} disabled={commentDraft.length === 0} type="submit">
                Comment
              </Button>
            </Box>
          )}
        </form>
      </Box>
      {/* List of comments from each user */}
      <Stack spacing={3}>
        {/* Comment component. Contains the comment and its replies*/}
        {comments?.map(comment => (
          <CommentComponent {...comment} recipeId={recipeId} removeComment={removeComment} addComment={addComment} key={comment.id} />
        ))}
      </Stack>
    </Box>
  );
}

function CommentComponent(props: Comment & any) {
  const theme = useTheme();
  // const [repliesOpen, setRepliesOpen] = useState(false);
  // const [replying, setIsReplying] = useState(false);
  // const replyCount = props.replies.length;
  // TODO: Search message for any @s of other people and turn them into links
  const [username, setUsername] = useState('Anonymous');
  const [liked, setLiked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isNotTablet = useMediaQuery(theme.breakpoints.up('lg'));
  const { user } = useAuth();

  useEffect(() => {
    getUsernameAndNumber(props.userId).then(response => {
      setUsername(response?.name || 'Anonymous');
    });
  }, [props.userId]);

  return (
    <Box display={'flex'} ml={5} gap={2} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <Avatar alt={'User Avatar'} />
      {/* Comment body */}
      <Container sx={{ pl: 1, ml: 0 }}>
        <Typography variant={'body1'} overflow={'clip'} maxWidth={'60vw'} color={'secondary.dark'}>
          {username === user?.uid ? 'You' : username}
        </Typography>
        <Typography variant={'body1'}>{props.commentBody}</Typography>
        {/* Like and Reply Bar */}
        <Grid container gap={1} mt={1} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton sx={{ borderRadius: 4, gap: 0.5 }} onClick={() => setLiked(prev => !prev)}>
            {liked ? <FavoriteIcon color={'primary'} /> : <FavoriteBorderIcon color={'primary'} />}
            {/* <Typography color={'text'}>{!props.likeCount && '0'}</Typography> */}
          </IconButton>
          {(!isNotTablet || isHovering) && <CommentOptions {...props} />}
          {/* <IconButton sx={{ borderRadius: 4, gap: 0.5 }} onClick={() => setIsReplying(!replying)}>
            <ChatBubbleOutline color={'secondary'} aria-label={'reply'} />
            <Typography variant={'body2'} color={'text'}>
              Reply
            </Typography>
          </IconButton> */}
        </Grid>
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
      </Container>
    </Box>
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
