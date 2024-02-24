import { Comment, CommentReply } from '../../../types/commentTypes';
import pic from '../../../assets/dummyPhotos/monke.png';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
/**
 * This is the comments section of a specific recipe's page.
 * This component handles the fetching and displaying of any comments related to the recipe
 */

const comments: Comment[] = [
  {
    id: 12345678,
    username: 'Moglio',
    message: 'Lorem Ipsum Dolor Sit Amet',
    likeCount: 0,
    replies: [],
  },
  {
    id: 12345679,
    username: 'Moglio',
    message: '@Moglio Nah he tweakin',
    likeCount: 5,
    replies: [
      {
        id: 12345680,
        username: 'Sadé',
        message: 'Not too shabby',
        likeCount: 0,
      },
      {
        id: 12345680,
        username: 'Sadé',
        message: 'Not too shabby',
        likeCount: 0,
      },
      {
        id: 12345680,
        username: 'Sadé',
        message: 'Not too shabby',
        likeCount: 0,
      },
    ],
  },
];

export default function CommentSection() {
  return (
    <section className={'recipe--comment--section--container'}>
      <Typography variant={'h3'} color={'text'}>
        Comments
      </Typography>
      <Divider variant={'middle'} sx={{ my: 1 }} />
      {/* List of comments from each user*/}
      <Stack spacing={2}>
        {/* Comment component. Contains the comment and its replies*/}
        {comments.map(commentData => (
          <CommentComponent {...commentData} key={commentData.id} />
        ))}
      </Stack>
    </section>
  );
}

function CommentComponent(props: Comment) {
  const [repliesOpen, setRepliesOpen] = useState(false);
  const replyCount = props.replies.length;
  // TODO: Search message for any @s of other people and turn them into links
  return (
    <>
      <Box display={'flex'} ml={5} gap={2}>
        <Avatar src={pic} alt="Moglio" />
        {/* Comment content container (username, rating */}
        <Box>
          <Typography color={'text'} variant={'h5'}>
            {props.username}
          </Typography>
          <Typography color={'text'} variant={'body1'}>
            {props.message}
          </Typography>
          {/* Like and Reply Bar */}
          <Box display={'flex'}>
            <IconButton aria-label={'like'}>
              <FavoriteBorderIcon color={'secondary'} />
              <Typography>{props.likeCount}</Typography>
            </IconButton>
            <Button color={'secondary'}>Reply</Button>
          </Box>
          {replyCount > 0 && (
            <>
              <Button
                size={'small'}
                variant={'contained'}
                color={'secondary'}
                className={'comment--reply--toggle--button'}
                onClick={() => setRepliesOpen(!repliesOpen)}
              >
                <Typography color={'text'}>
                  {replyCount} {replyCount > 1 ? 'replies' : 'reply'}
                </Typography>
              </Button>
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
        <Typography color={'text'} variant={'h6'}>
          {props.username}
        </Typography>
        <Typography color={'text'} variant={'body2'}>
          {props.message}
        </Typography>
        {/*  Like and Reply Bar*/}
        <Box display={'flex'}>
          <IconButton aria-label={'like'}>
            <FavoriteBorderIcon fontSize={'small'} color={'secondary'} />
            <Typography>{props.likeCount}</Typography>
          </IconButton>
          <Button color={'secondary'}>Reply</Button>
        </Box>
      </Box>
    </Box>
  );
}
