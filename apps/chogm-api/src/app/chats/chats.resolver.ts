import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GqlAuthGuard } from '../auth/auth.guard';
import { PUB_SUB } from '../config/pub-sub.module';
import {
  CHAT_EVENT,
  QUERY_CHAT_EVENT,
  USER_CHART_EVENT,
} from '../utils/events';
import { CreateChatInput, queryTypeInput } from './dto/create-chat.input';
import { ReplyChatInput } from './dto/reply-chat.input';
import { Chat } from './entities/chat.entity';
import { ChatsService } from './services/chats.service';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Chat)
  sendNewChat(@Args('createChatInput') chat: CreateChatInput) {
    return this.chatsService.create(chat);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Chat)
  replyChat(@Args('ReplyChatInput') chat: ReplyChatInput) {
    return this.chatsService.update(chat);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Chat], { name: 'chats' })
  findAllByUser(@Args('userId') userId: string) {
    return this.chatsService.findAllUserId(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Chat, { name: 'chatsById' })
  chatsById(@Args('chatId') id: string) {
    return this.chatsService.findChat(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Chat], { name: 'chatsByNOC' })
  chatsByNOC() {
    return this.chatsService.findNocMessages();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Chat], { name: 'categorizedChats' })
  categorizedChats(@Args('queryTypeInput') type: queryTypeInput) {
    return this.chatsService.findCategorizedChats(type);
  }

  @Subscription(() => Chat, {
    name: 'chatEvent',
  })
  chatEvent() {
    return this.pubSub.asyncIterator<Chat>(CHAT_EVENT);
  }

  @Subscription(() => Chat, {
    name: 'queryChatEvent',
    filter: (payload, variables) => {
      return (
        payload.userChatEvent.queryType === variables.queryTypeInput.queryType
      );
    },
  })
  queryChatEvent(@Args('queryTypeInput') type: queryTypeInput) {
    return this.pubSub.asyncIterator<Chat>(QUERY_CHAT_EVENT);
  }

  @Subscription(() => Chat, {
    name: 'userChatEvent',
    filter: (payload, variables) => {
      return payload.userChatEvent.users.find(
        (user) => user.id === variables.userId
      );
    },
  })
  userChatEvent(@Args('userId') userId: string) {
    return this.pubSub.asyncIterator<Chat>(USER_CHART_EVENT);
  }
}
