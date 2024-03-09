import { Comment, CommentReply } from '../../../types/commentTypes';
import pic from '../../../assets/dummyPhotos/monke.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Box, Button, Divider, IconButton, Input, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ChatBubbleOutline, KeyboardArrowDown } from '@mui/icons-material';
// import { getComments } from '@api/comments.ts';
/**
 * This is the comments section of a specific recipe's page.
 * This component handles the fetching and displaying of any comments related to the recipe
 */
// Dummy data for comments
const commentsData: Comment[] = [
  {
    id: 1,
    username: 'Moglio',
    commentBody: 'This is a comment',
    likeCount: 2,
    replies: [
      {
        id: 1,
        username: 'Moglio',
        message: 'This is a reply',
        likeCount: 3,
      },
    ],
  },
  {
    id: 2,
    username: 'Bob',
    commentBody: 'This is a comment',
    likeCount: 1,
    replies: [
      {
        id: 1,
        username: 'Moglio',
        message: 'This is a reply',
        likeCount: 4,
      },
      {
        id: 2,
        username: 'Moglio',
        message: 'This is a reply',
        likeCount: 5,
      },
    ],
  },
];

export default function CommentSection({ recipeId }: { recipeId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showControls, setShowControls] = useState(false);

  // Fetch the comments on load up
  useEffect(() => {
    // getComments(recipeId).then(newComments => {
    //   setComments(newComments);
    // });
    setComments(commentsData);
  }, [recipeId]);

  const commentCount = comments?.length;

  return (
    <Box>
      {/* Comments header */}
      <Typography variant={'h3'} color={'text'}>
        Comments ({commentCount})
      </Typography>
      <Divider variant={'fullWidth'} sx={{ my: 1, mb: 3 }} />
      {/* Comment input */}
      <Box display={'flex'} flexDirection={'column'} mb={4} gap={2}>
        <Box display={'flex'} gap={2}>
          <Avatar src={pic} alt="Moglio" />
          <Input
            type={'text'}
            placeholder={'Add a comment...'}
            color={'secondary'}
            onFocus={() => setShowControls(true)}
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
            <Button variant={'text'} color={'secondary'}>
              Comment
            </Button>
          </Box>
        )}
      </Box>
      {/* List of comments from each user */}
      <Stack spacing={3}>
        {/* Comment component. Contains the comment and its replies*/}
        {comments?.map(commentData => <CommentComponent {...commentData} key={commentData.id} />)}
      </Stack>
    </Box>
  );
}

function CommentComponent(props: Comment) {
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [replying, setIsReplying] = useState(false);
  const replyCount = props.replies.length;
  // TODO: Search message for any @s of other people and turn them into links
  return (
    <>
      <Box display={'flex'} ml={5} gap={2}>
        <Avatar src={pic} alt={'Modglio'} />
        {/* Comment body */}
        <Box>
          <Typography color={'text'} variant={'h5'}>
            {props.username}
          </Typography>
          <Typography color={'text'} variant={'body1'}>
            {props.commentBody}
          </Typography>
          {/* Like and Reply Bar */}
          <Box display={'flex'} gap={1} mt={1}>
            <IconButton sx={{ borderRadius: 4, gap: 0.5 }}>
              <FavoriteBorderIcon color={'secondary'} />
              <Typography color={'text'}>{props.likeCount}</Typography>
            </IconButton>
            <IconButton sx={{ borderRadius: 4, gap: 0.5 }} onClick={() => setIsReplying(!replying)}>
              <ChatBubbleOutline color={'secondary'} aria-label={'reply'} />
              <Typography variant={'body2'} color={'text'}>
                Reply
              </Typography>
            </IconButton>
          </Box>
          {/* Reply input */}
          {replying && (
            <Box display={'flex'} flexDirection={'column'} ml={1} mt={1} gap={2}>
              <Box display={'flex'} gap={2}>
                <Avatar src={pic} alt={'Moglio'} />
                <Input type={'text'} placeholder={'Add a reply...'} color={'secondary'} sx={{ width: '100%' }} multiline />
              </Box>
              {/* Reply controls (cancel, reply) */}
              <Box display={'flex'} gap={2} justifyContent={'flex-end'} sx={{ width: '100%' }}>
                <Button variant={'text'} color={'secondary'} onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button variant={'text'} color={'secondary'}>
                  Reply
                </Button>
              </Box>
            </Box>
          )}
          {/* Replies */}
          {replyCount > 0 && (
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
          )}
        </Box>
      </Box>
    </>
  );
}

function CommentReplyComponent(props: CommentReply) {
  return (
    <Box display={'flex'} ml={1} gap={2}>
      <Avatar src={pic} alt={'Moglio'} />
      <Box>
        {/* Comment body */}
        <Typography color={'text'} variant={'h6'}>
          {props.username}
        </Typography>
        <Typography color={'text'} variant={'body1'}>
          {props.message}
        </Typography>
        {/*  Like and Reply Bar*/}
        <Box display={'flex'} gap={1} mt={1}>
          <IconButton sx={{ borderRadius: 4, gap: 0.5 }}>
            <FavoriteBorderIcon color={'secondary'} />
            <Typography color={'text'}>{props.likeCount}</Typography>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
