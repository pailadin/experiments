export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** String representation of a binary ID. */
  Binary: any
  /** Valid country codes. Call `Query.countries` to get list of valid country codes. */
  Country: any
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any
  /** String representation of military time format. Example: `23:15` = 11:15 PM */
  MilitaryTimeFormat: any
  /** Numeric representation of a mood where 1 is BAD and 5 is GREAT. */
  MoodNumber: any
  /** A string that cannot be passed as an empty value */
  NonEmptyString: any
  /** Password string encoded to base-64. */
  Password: any
  /** Timezone string */
  Timezone: any
}

export enum Account_Type {
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export type Account = {
  __typename?: 'Account'
  email: Scalars['EmailAddress']
  id: Scalars['Binary']
  name?: Maybe<Scalars['String']>
  onboardingStep: Onboarding_Step
  role?: Maybe<Scalars['String']>
  timezone?: Maybe<Scalars['String']>
  type: Account_Type
}

export type AnniversaryPost = Commentable &
  Node &
  Post &
  Reactable & {
    __typename?: 'AnniversaryPost'
    commented: Scalars['Boolean']
    comments: CommentConnection
    date: Scalars['DateTime']
    id: Scalars['Binary']
    member: Member
    pinned: Scalars['Boolean']
    postTags: Array<PostTag>
    reacted: Scalars['Boolean']
    reactions: Array<Reaction>
    saved: Scalars['Boolean']
    /** @deprecated Use `postTags` instead. */
    tags: Array<Scalars['String']>
    tenurity: Scalars['Int']
    type: Post_Type
  }

export type AnniversaryPostCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export type AuthenticateWithCodeInput = {
  code: Scalars['String']
  email: Scalars['String']
}

export type AuthenticateWithCodePayload = {
  __typename?: 'AuthenticateWithCodePayload'
  account: Account
  token: Scalars['String']
}

export type AuthenticateWithPasswordInput = {
  email: Scalars['String']
  password: Scalars['Password']
}

export type AuthenticateWithPasswordPayload = {
  __typename?: 'AuthenticateWithPasswordPayload'
  account: Account
  token: Scalars['String']
}

export type BinaryQueryOperatorInput = {
  eq?: Maybe<Scalars['Binary']>
  in?: Maybe<Array<Scalars['Binary']>>
  ne?: Maybe<Scalars['Binary']>
  nin?: Maybe<Array<Scalars['Binary']>>
}

export type BirthdayPost = Commentable &
  Node &
  Post &
  Reactable & {
    __typename?: 'BirthdayPost'
    commented: Scalars['Boolean']
    comments: CommentConnection
    date: Scalars['DateTime']
    id: Scalars['Binary']
    member: Member
    pinned: Scalars['Boolean']
    postTags: Array<PostTag>
    reacted: Scalars['Boolean']
    reactions: Array<Reaction>
    saved: Scalars['Boolean']
    /** @deprecated Use `postTags` instead. */
    tags: Array<Scalars['String']>
    type: Post_Type
  }

export type BirthdayPostCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export type Boost = {
  __typename?: 'Boost'
  boostedMembers: Array<Member>
  caption?: Maybe<Scalars['String']>
  coreValue: CoreValue
  id: Scalars['Binary']
}

export type BoostBackgroundImage = {
  __typename?: 'BoostBackgroundImage'
  id: Scalars['ID']
  image: Scalars['String']
}

export type BoostModuleSettings = {
  __typename?: 'BoostModuleSettings'
  enabled: Scalars['Boolean']
}

export type BoostPost = Commentable &
  Node &
  Post &
  Reactable & {
    __typename?: 'BoostPost'
    boost: Boost
    commented: Scalars['Boolean']
    comments: CommentConnection
    date: Scalars['DateTime']
    id: Scalars['Binary']
    member: Member
    pinned: Scalars['Boolean']
    postTags: Array<PostTag>
    reacted: Scalars['Boolean']
    reactions: Array<Reaction>
    saved: Scalars['Boolean']
    /** @deprecated Use `postTags` instead. */
    tags: Array<Scalars['String']>
    type: Post_Type
  }

export type BoostPostCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export type Broadcast = {
  __typename?: 'Broadcast'
  body?: Maybe<Scalars['String']>
  id: Scalars['Binary']
  media: Array<Media>
  subtype: Post_Subtype
  title?: Maybe<Scalars['String']>
}

export type BroadcastMediaInput = {
  type: Media_Type
  url: Scalars['String']
}

export type BroadcastPost = Commentable &
  Node &
  Post &
  Reactable & {
    __typename?: 'BroadcastPost'
    broadcast: Broadcast
    commented: Scalars['Boolean']
    comments: CommentConnection
    date: Scalars['DateTime']
    id: Scalars['Binary']
    member: Member
    pinned: Scalars['Boolean']
    postTags: Array<PostTag>
    reacted: Scalars['Boolean']
    reactions: Array<Reaction>
    saved: Scalars['Boolean']
    /** @deprecated Use `postTags` instead. */
    tags: Array<Scalars['String']>
    type: Post_Type
  }

export type BroadcastPostCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export enum Check_In_Answer_Type {
  Blocker = 'BLOCKER',
  Boolean = 'BOOLEAN',
  Emoji = 'EMOJI',
  Goal = 'GOAL',
  Numeric = 'NUMERIC',
  Open = 'OPEN',
  Sentiment = 'SENTIMENT',
}

export enum Check_In_Question_Type {
  Blocker = 'BLOCKER',
  Boolean = 'BOOLEAN',
  Boost = 'BOOST',
  Emoji = 'EMOJI',
  Goal = 'GOAL',
  Numeric = 'NUMERIC',
  Open = 'OPEN',
  Sentiment = 'SENTIMENT',
}

export type CancelEmailInvitationInput = {
  email: Scalars['EmailAddress']
}

export type CancelEmailInvitationPayload = {
  __typename?: 'CancelEmailInvitationPayload'
  cancelled: Scalars['Boolean']
}

export type CheckInAnswer = Node & {
  __typename?: 'CheckInAnswer'
  bool?: Maybe<Scalars['Boolean']>
  date: Scalars['DateTime']
  emoji?: Maybe<Scalars['String']>
  id: Scalars['Binary']
  number?: Maybe<Scalars['Int']>
  previousGoals?: Maybe<PreviousCheckInGoals>
  /** @deprecated Use `previousGoals` instead. */
  previousTasks: Array<CheckInAnswerTask>
  question: Scalars['String']
  sentiment?: Maybe<Sentiment_Level>
  tasks: Array<CheckInAnswerTask>
  text?: Maybe<Scalars['String']>
  type: Check_In_Answer_Type
}

export type CheckInAnswerTask = Node & {
  __typename?: 'CheckInAnswerTask'
  description?: Maybe<Scalars['String']>
  done: Scalars['Boolean']
  id: Scalars['Binary']
  text: Scalars['String']
}

export type CheckInAnswerTaskInput = {
  description?: Maybe<Scalars['String']>
  done?: Scalars['Boolean']
  text: Scalars['NonEmptyString']
}

export type CheckInPost = Commentable &
  Node &
  Post &
  Reactable & {
    __typename?: 'CheckInPost'
    checkInReply: CheckInReply
    commented: Scalars['Boolean']
    comments: CommentConnection
    date: Scalars['DateTime']
    id: Scalars['Binary']
    member: Member
    pinned: Scalars['Boolean']
    postTags: Array<PostTag>
    reacted: Scalars['Boolean']
    reactions: Array<Reaction>
    saved: Scalars['Boolean']
    /** @deprecated Use `postTags` instead. */
    tags: Array<Scalars['String']>
    type: Post_Type
  }

export type CheckInPostCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export type CheckInQuestion = {
  __typename?: 'CheckInQuestion'
  secondaryText?: Maybe<Scalars['String']>
  text: Scalars['String']
  type: Check_In_Question_Type
}

export type CheckInReply = {
  __typename?: 'CheckInReply'
  checkInAnswers: Array<CheckInAnswer>
}

export type CheckInReplyForm = {
  __typename?: 'CheckInReplyForm'
  checkInId: Scalars['Binary']
  checkInName: Scalars['String']
  id: Scalars['Binary']
  questions: Array<CheckInReplyFormQuestion>
  submitted: Scalars['Boolean']
}

export type CheckInReplyFormBlockerQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormBlockerQuestion'
  answer?: Maybe<CheckInAnswer>
  question: Scalars['String']
  questionId: Scalars['Binary']
}

export type CheckInReplyFormBooleanQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormBooleanQuestion'
  answer?: Maybe<CheckInAnswer>
  question: Scalars['String']
  questionId: Scalars['Binary']
}

export type CheckInReplyFormBoostQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormBoostQuestion'
  question: Scalars['String']
}

export type CheckInReplyFormCurrentGoalQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormCurrentGoalQuestion'
  answer?: Maybe<CheckInAnswer>
  question: Scalars['String']
  questionId: Scalars['Binary']
}

export type CheckInReplyFormEmojiQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormEmojiQuestion'
  answer?: Maybe<CheckInAnswer>
  emojis: Array<Scalars['String']>
  question: Scalars['String']
  questionId: Scalars['Binary']
}

export type CheckInReplyFormNumericQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormNumericQuestion'
  answer?: Maybe<CheckInAnswer>
  question: Scalars['String']
  questionId: Scalars['Binary']
}

export type CheckInReplyFormOpenQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormOpenQuestion'
  answer?: Maybe<CheckInAnswer>
  question: Scalars['String']
  questionId: Scalars['Binary']
}

export type CheckInReplyFormPreviousGoalQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormPreviousGoalQuestion'
  answer?: Maybe<CheckInAnswer>
  question: Scalars['String']
}

export type CheckInReplyFormQuestion = {
  question: Scalars['String']
}

export type CheckInReplyFormSentimentQuestion = CheckInReplyFormQuestion & {
  __typename?: 'CheckInReplyFormSentimentQuestion'
  answer?: Maybe<CheckInAnswer>
  question: Scalars['String']
  questionId: Scalars['Binary']
}

export type Comment = Node &
  Reactable & {
    __typename?: 'Comment'
    author: Member
    content: Scalars['String']
    createdAt: Scalars['DateTime']
    id: Scalars['Binary']
    reacted: Scalars['Boolean']
    reactions: Array<Reaction>
    updatedAt: Scalars['DateTime']
  }

export type CommentConnection = {
  __typename?: 'CommentConnection'
  edges: Array<CommentEdge>
  pageInfo: PageInfo
  totalCount: Scalars['Int']
}

export type CommentEdge = {
  __typename?: 'CommentEdge'
  cursor: Scalars['Binary']
  node: Comment
}

export type Commentable = {
  commented: Scalars['Boolean']
  comments: CommentConnection
}

export type CommentableCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export type CommentsFilterInput = {
  parentId: BinaryQueryOperatorInput
}

export type CommentsPageSort = {
  date: Scalars['Int']
}

export type CompanyEvent = AnniversaryPost | BirthdayPost | NewMemberPost

export type CompleteDailyReviewInput = {
  id: Scalars['Binary']
}

export type CompleteDailyReviewPayload = {
  __typename?: 'CompleteDailyReviewPayload'
  streak: Scalars['Int']
}

export type CoreValue = Node & {
  __typename?: 'CoreValue'
  description: Scalars['String']
  enabled: Scalars['Boolean']
  id: Scalars['Binary']
  name: Scalars['String']
}

export type CoreValueFilter = {
  enabled?: Maybe<Scalars['Boolean']>
}

export type CreateBoostBody = {
  accountIds: Array<Scalars['Binary']>
  backgroundImageId: Scalars['ID']
  caption?: Maybe<Scalars['String']>
  coreValueId: Scalars['Binary']
}

export type CreateBoostInput = {
  body: CreateBoostBody
  fromCheckIn?: Scalars['Boolean']
}

export type CreateBoostPayload = {
  __typename?: 'CreateBoostPayload'
  boost: Boost
  /** @deprecated Refer to `boost` object instead. */
  id: Scalars['Binary']
}

export type CreateCheckInAnswerBody = {
  bool?: Maybe<Scalars['Boolean']>
  checkInReplyFormId: Scalars['Binary']
  emoji?: Maybe<Scalars['String']>
  number?: Maybe<Scalars['Int']>
  questionId: Scalars['Binary']
  sentiment?: Maybe<Sentiment_Level>
  tasks?: Maybe<Array<CheckInAnswerTaskInput>>
  text?: Maybe<Scalars['NonEmptyString']>
}

export type CreateCheckInAnswerInput = {
  body: CreateCheckInAnswerBody
}

export type CreateCheckInAnswerPayload = {
  __typename?: 'CreateCheckInAnswerPayload'
  answer: CheckInAnswer
}

export type CreateCommentBody = {
  content: Scalars['NonEmptyString']
  parentId: Scalars['Binary']
}

export type CreateCommentInput = {
  body: CreateCommentBody
}

export type CreateCommentPayload = {
  __typename?: 'CreateCommentPayload'
  comment: Comment
}

export type CreateCoreValueBody = {
  description: Scalars['String']
  name: Scalars['String']
}

export type CreateCoreValueInput = {
  body: CreateCoreValueBody
}

export type CreateCoreValuePayload = {
  __typename?: 'CreateCoreValuePayload'
  coreValue: CoreValue
}

export type CreateInviteCodeInput = {
  code: Scalars['String']
  email: Scalars['String']
  otp: Scalars['String']
}

export type CreateMoodBody = {
  color: Scalars['MoodNumber']
  emoji?: Maybe<Scalars['String']>
  emotion?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  isPrivate?: Maybe<Scalars['Boolean']>
  message?: Maybe<Scalars['String']>
}

export type CreateMoodInput = {
  body: CreateMoodBody
}

export type CreateMoodPayload = {
  __typename?: 'CreateMoodPayload'
  id: Scalars['Binary']
  mood: MoodEntry
}

export type CreateOrganizationBody = {
  logo: Scalars['String']
  name: Scalars['String']
}

export type CreateOrganizationInput = {
  body: CreateOrganizationBody
}

export type CreateOrganizationPayload = {
  __typename?: 'CreateOrganizationPayload'
  organization: Organization
}

export type CreatePostBody = {
  body?: Maybe<Scalars['String']>
  media?: Maybe<Array<BroadcastMediaInput>>
  title?: Maybe<Scalars['String']>
}

export type CreatePostInput = {
  body: CreatePostBody
}

export type CreatePostPayload = {
  __typename?: 'CreatePostPayload'
  cursor: Scalars['Binary']
  post: BroadcastPost
}

export type CreateReactionBody = {
  emoji: Scalars['String']
  parentId: Scalars['Binary']
}

export type CreateReactionInput = {
  body: CreateReactionBody
}

export type CreateReactionPayload = {
  __typename?: 'CreateReactionPayload'
  /** @deprecated Refer to `reaction` object instead. */
  emoji: Scalars['String']
  /** @deprecated Refer to `reaction` object instead. */
  id: Scalars['Binary']
  reaction: Reaction
}

export type CreateTeamBody = {
  color?: Maybe<Scalars['String']>
  memberIds: Array<Scalars['Binary']>
  name: Scalars['String']
}

export type CreateTeamInput = {
  body: CreateTeamBody
}

export type CreateTeamPayload = {
  __typename?: 'CreateTeamPayload'
  team: Team
}

export enum Daily_Review_Settings_Status {
  Idle = 'IDLE',
  WaitingResponses = 'WAITING_RESPONSES',
}

export enum Daily_Review_Status {
  Closed = 'CLOSED',
  Completed = 'COMPLETED',
  Ready = 'READY',
}

export type DailyReview = {
  __typename?: 'DailyReview'
  checkInEnabled: Scalars['Boolean']
  checkInForm?: Maybe<CheckInReplyForm>
  checkInSubmitted: Scalars['Boolean']
  closesAt: Scalars['DateTime']
  /** @deprecated Refer to `status` property instead and check if value is `COMPLETED`. */
  completed: Scalars['Boolean']
  id: Scalars['Binary']
  moodEnabled: Scalars['Boolean']
  moodSubmitted: Scalars['Boolean']
  settings: DailyReviewSettings
  startedAt: Scalars['DateTime']
  status: Daily_Review_Status
}

export type DailyReviewCheckInQuestionInput = {
  secondaryText?: Maybe<Scalars['String']>
  text: Scalars['String']
  type: Check_In_Question_Type
}

export type DailyReviewEntriesFilterInput = {
  accountId?: Maybe<BinaryQueryOperatorInput>
  date?: Maybe<DateQueryOperatorInput>
  directReportsOnly?: Maybe<Scalars['Boolean']>
}

export type DailyReviewEntry = Node & {
  __typename?: 'DailyReviewEntry'
  checkInPost?: Maybe<CheckInPost>
  companyEvents: Array<CompanyEvent>
  date: Scalars['DateTime']
  id: Scalars['Binary']
  member: Member
  moodPost?: Maybe<MoodPost>
}

export type DailyReviewEntryConnection = {
  __typename?: 'DailyReviewEntryConnection'
  edges: Array<DailyReviewEntryEdge>
  pageInfo: PageInfo
}

export type DailyReviewEntryEdge = {
  __typename?: 'DailyReviewEntryEdge'
  cursor: Scalars['Binary']
  node: DailyReviewEntry
}

export type DailyReviewSession = {
  __typename?: 'DailyReviewSession'
  dailyReviewEntries: Array<DailyReviewEntry>
  date: Scalars['DateTime']
  id: Scalars['Binary']
}

export type DailyReviewSessionDailyReviewEntriesArgs = {
  filter?: Maybe<DailyReviewEntriesFilterInput>
}

export type DailyReviewSessionConnection = {
  __typename?: 'DailyReviewSessionConnection'
  edges: Array<DailyReviewSessionEdge>
  pageInfo: PageInfo
}

export type DailyReviewSessionEdge = {
  __typename?: 'DailyReviewSessionEdge'
  cursor: Scalars['Binary']
  node: DailyReviewSession
}

export type DailyReviewSessionsFilterInput = {
  date?: Maybe<DateQueryOperatorInput>
}

export type DailyReviewSettings = {
  __typename?: 'DailyReviewSettings'
  checkInEnabled: Scalars['Boolean']
  checkInQuestions: Array<CheckInQuestion>
  companyEventsEnabled: Scalars['Boolean']
  duration: Scalars['Int']
  enabled: Scalars['Boolean']
  moodEnabled: Scalars['Boolean']
  remindOnMissingResponse: Scalars['Boolean']
  remindOnMissingResponseAfter: Scalars['Int']
  respondentIds: Array<Scalars['Binary']>
  respondents: Array<Member>
  sendRemindersToEmail: Scalars['Boolean']
  status?: Maybe<Daily_Review_Settings_Status>
  time: Scalars['MilitaryTimeFormat']
  timezone?: Maybe<Scalars['Timezone']>
}

export type DailyReviewSubmitCountFilter = {
  date: DailyReviewSubmitCountFilterDateInput
}

export type DailyReviewSubmitCountFilterDateInput = {
  gte: Scalars['DateTime']
  lte: Scalars['DateTime']
}

export type DashboardMetrics = {
  __typename?: 'DashboardMetrics'
  boostsGiven: Scalars['Int']
  boostsReceived: Scalars['Int']
  checkInsDone: Scalars['Int']
  tasksDone: Scalars['Int']
  totalComments: Scalars['Int']
  totalReactions: Scalars['Int']
}

export type DateQueryOperatorInput = {
  eq?: Maybe<Scalars['DateTime']>
  gt?: Maybe<Scalars['DateTime']>
  gte?: Maybe<Scalars['DateTime']>
  lt?: Maybe<Scalars['DateTime']>
  lte?: Maybe<Scalars['DateTime']>
}

export type DeactivateAccountInput = {
  id: Scalars['Binary']
}

export type DeleteCommentInput = {
  id: Scalars['Binary']
}

export type DeleteCommentPayload = {
  __typename?: 'DeleteCommentPayload'
  deleted: Scalars['Boolean']
}

export type DeleteCoreValueInput = {
  id: Scalars['Binary']
}

export type DeleteCoreValuePayload = {
  __typename?: 'DeleteCoreValuePayload'
  deleted: Scalars['Boolean']
}

export type DeleteMemberInput = {
  id: Scalars['Binary']
}

export type DeleteMemberPayload = {
  __typename?: 'DeleteMemberPayload'
  deleted: Scalars['Boolean']
}

export type DeletePostInput = {
  id: Scalars['Binary']
}

export type DeletePostPayload = {
  __typename?: 'DeletePostPayload'
  deleted: Scalars['Boolean']
}

export type DeleteReactionInput = {
  id: Scalars['Binary']
}

export type DeleteReactionPayload = {
  __typename?: 'DeleteReactionPayload'
  deleted: Scalars['Boolean']
}

export type DeleteTeamInput = {
  id: Scalars['Binary']
}

export type DeleteTeamPayload = {
  __typename?: 'DeleteTeamPayload'
  deleted: Scalars['Boolean']
}

export type DirectReport = {
  __typename?: 'DirectReport'
  lastBoostGivenAt?: Maybe<Scalars['DateTime']>
  member: Member
}

export type DirectReportSelectionFilterInput = {
  memberId: DirectReportSelectionMemberIdInput
}

export type DirectReportSelectionMemberIdInput = {
  eq: Scalars['Binary']
}

export type DisableBoostModulePayload = {
  __typename?: 'DisableBoostModulePayload'
  enabled: Scalars['Boolean']
}

export type DisableCoreValueInput = {
  id: Scalars['Binary']
}

export type DisableCoreValuePayload = {
  __typename?: 'DisableCoreValuePayload'
  coreValue: CoreValue
}

export type DisableDailyReviewPayload = {
  __typename?: 'DisableDailyReviewPayload'
  dailyReviewSettings: DailyReviewSettings
}

export type EnableBoostModulePayload = {
  __typename?: 'EnableBoostModulePayload'
  enabled: Scalars['Boolean']
}

export type EnableCoreValueInput = {
  id: Scalars['Binary']
}

export type EnableCoreValuePayload = {
  __typename?: 'EnableCoreValuePayload'
  coreValue: CoreValue
}

export type ExchangeInviteCodeForOtpInput = {
  code: Scalars['String']
  email: Scalars['EmailAddress']
}

export enum File_Type {
  Image = 'IMAGE',
  Video = 'VIDEO',
}

export enum File_Upload_Use {
  Post = 'POST',
}

export type FollowInput = {
  accountId: Scalars['Binary']
}

export type FollowPayload = {
  __typename?: 'FollowPayload'
  followed: Scalars['Boolean']
}

export type GenerateLoginOtpInput = {
  email: Scalars['EmailAddress']
}

export type GenerateLoginOtpPayload = {
  __typename?: 'GenerateLoginOTPPayload'
  otp?: Maybe<Scalars['String']>
}

export type GenerateUploadPolicyInput = {
  filename: Scalars['String']
  use: File_Upload_Use
}

export type GenerateUploadPolicyPayload = {
  __typename?: 'GenerateUploadPolicyPayload'
  credentials: UploadPolicyCredentials
}

export type Holiday = Node &
  TimeOff & {
    __typename?: 'Holiday'
    allCountries: Scalars['Boolean']
    countries: Array<Scalars['Country']>
    duration: Scalars['String']
    from: Scalars['DateTime']
    id: Scalars['Binary']
    name: Scalars['String']
    to: Scalars['DateTime']
    type: Time_Off_Type
  }

export type InitializeLoginInput = {
  email: Scalars['EmailAddress']
}

export type InitializeLoginPayload = {
  __typename?: 'InitializeLoginPayload'
  email: Scalars['EmailAddress']
  passwordless: Scalars['Boolean']
}

export type InviteMembersByEmailsInput = {
  addToDailyReview?: Maybe<Scalars['Boolean']>
  emails: Array<Scalars['EmailAddress']>
}

export type InviteMembersByEmailsPayload = {
  __typename?: 'InviteMembersByEmailsPayload'
  invitedEmails: Array<Scalars['EmailAddress']>
}

export enum Media_Type {
  Image = 'IMAGE',
  Video = 'VIDEO',
}

export enum Member_Status {
  Active = 'ACTIVE',
  Invited = 'INVITED',
}

export enum Member_Type {
  Admin = 'ADMIN',
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export enum Member_Type_Update_Options {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}

export enum Mood_Color {
  Blue = 'BLUE',
  Green = 'GREEN',
  Orange = 'ORANGE',
  Red = 'RED',
  Yellow = 'YELLOW',
}

export type MagicLoginInput = {
  enabled: Scalars['Boolean']
  password?: Maybe<Scalars['Password']>
}

export type Media = {
  __typename?: 'Media'
  type: Media_Type
  url: Scalars['String']
}

export type Member = Node & {
  __typename?: 'Member'
  about?: Maybe<Scalars['String']>
  avatar?: Maybe<Scalars['String']>
  birthdate?: Maybe<Scalars['DateTime']>
  birthday?: Maybe<Scalars['DateTime']>
  cover?: Maybe<Scalars['String']>
  createdAt: Scalars['DateTime']
  directReports: Array<Member>
  email: Scalars['String']
  employmentDate?: Maybe<Scalars['DateTime']>
  /** @deprecated Use `name` instead. */
  firstname?: Maybe<Scalars['String']>
  followed: Scalars['Boolean']
  id: Scalars['Binary']
  isPrimaryOwner: Scalars['Boolean']
  /** @deprecated Please use `role` instead. */
  jobTitle?: Maybe<Scalars['String']>
  lastActive: Scalars['DateTime']
  /** @deprecated Use `name` instead. */
  lastname?: Maybe<Scalars['String']>
  links?: Maybe<Array<SocialMediaHandle>>
  location?: Maybe<Scalars['String']>
  manager?: Maybe<Member>
  name?: Maybe<Scalars['String']>
  passwordless?: Maybe<Scalars['Boolean']>
  phone?: Maybe<Scalars['String']>
  profileCompletion: Scalars['Float']
  role?: Maybe<Scalars['String']>
  shortName?: Maybe<Scalars['String']>
  slackUserId?: Maybe<Scalars['String']>
  status: Member_Status
  teams: Array<Team>
  tenancy?: Maybe<Scalars['String']>
  /** @deprecated Use `tenancy` instead. */
  tenurity?: Maybe<Scalars['Int']>
  tenurityPercentage?: Maybe<Scalars['Float']>
  timezone?: Maybe<Scalars['Timezone']>
  type: Member_Type
}

export type MobileVersionsInput = {
  platform: Scalars['String']
}

export type MobileVersionsPayload = {
  __typename?: 'MobileVersionsPayload'
  latestVersion: Scalars['String']
  minimumVersion: Scalars['String']
}

export type MoodCountFilterInput = {
  date?: Maybe<DateQueryOperatorInput>
}

export type MoodEntry = {
  __typename?: 'MoodEntry'
  color: Scalars['MoodNumber']
  createdAt: Scalars['DateTime']
  emoji?: Maybe<Scalars['String']>
  emotion?: Maybe<Scalars['String']>
  id: Scalars['Binary']
  image?: Maybe<Scalars['String']>
  isPrivate: Scalars['Boolean']
  message?: Maybe<Scalars['String']>
}

export type MoodHistoryFilterInput = {
  accountId: BinaryQueryOperatorInput
  createdAt: DateQueryOperatorInput
}

export type MoodMetrics = {
  __typename?: 'MoodMetrics'
  color: Scalars['MoodNumber']
  percentage: Scalars['Float']
}

export type MoodMetricsFilterInput = {
  date?: Maybe<DateQueryOperatorInput>
}

export type MoodPost = Commentable &
  Node &
  Post &
  Reactable & {
    __typename?: 'MoodPost'
    commented: Scalars['Boolean']
    comments: CommentConnection
    date: Scalars['DateTime']
    id: Scalars['Binary']
    member: Member
    mood: MoodEntry
    pinned: Scalars['Boolean']
    postTags: Array<PostTag>
    reacted: Scalars['Boolean']
    reactions: Array<Reaction>
    saved: Scalars['Boolean']
    /** @deprecated Use `postTags` instead. */
    tags: Array<Scalars['String']>
    type: Post_Type
  }

export type MoodPostCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export type Mutation = {
  __typename?: 'Mutation'
  /**
   * Authenticate user with a magic code.
   *
   * Possible error codes:
   *
   * `EMAIL_ADDRESS_NOT_FOUND`
   *
   * `MAGIC_LOGIN_CODE_NOT_TRIGGERED`
   *
   * `INVALID_MAGIC_LOGIN_CODE`
   */
  authenticateWithCode: AuthenticateWithCodePayload
  /**
   * Authenticate user with a password. Input `password` needs to be base64-encoded.
   *
   * Possible error codes:
   *
   * `EMAIL_ADDRESS_NOT_FOUND`
   *
   * `INVALID_EMAIL_OR_PASSWORD`
   */
  authenticateWithPassword: AuthenticateWithPasswordPayload
  /**
   * Cancel email invitation.
   *
   * Possible error codes:
   *
   * `INVITED_EMAIL_NOT_FOUND`
   */
  cancelEmailInvitation: CancelEmailInvitationPayload
  /**
   * Complete a daily review.
   *
   * Possible error codes:
   *
   * `DAILY_REVIEW_NOT_FOUND`
   *
   * `CAN_ONLY_COMPLETE_OWN_DAILY_REVIEW`
   *
   * `DAILY_REVIEW_CLOSED`
   *
   * `MISSING_DAILY_REVIEW_ITEMS`
   */
  completeDailyReview: CompleteDailyReviewPayload
  /** Send boost. */
  createBoost: CreateBoostPayload
  /** Create check-in answer. */
  createCheckInAnswer: CreateCheckInAnswerPayload
  /** Create comment. */
  createComment: CreateCommentPayload
  /** Create Core Value */
  createCoreValue: CreateCoreValuePayload
  /** Create inviteCode for test automation */
  createInviteCode: Scalars['Boolean']
  /**
   * Submit a mood entry for the day.
   *
   * Possible error codes:
   *
   * `USER_NOT_PARTICIPANT_OF_MOOD_TRACKER`
   *
   * `NO_MOOD_TRACKER_TODAY`
   *
   * `MOOD_ENTRY_ALREADY_SUBMITTED`
   */
  createMood: CreateMoodPayload
  /** Create an organization */
  createOrganization: CreateOrganizationPayload
  createPost: CreatePostPayload
  /** Create reaction. Consecutive calls on the same `parentId` updates the emoji. */
  createReaction: CreateReactionPayload
  createTeam: CreateTeamPayload
  /** Deactivate Account */
  deactivateAccount: Scalars['Boolean']
  /** Delete comment. */
  deleteComment: DeleteCommentPayload
  deleteCoreValue: DeleteCoreValuePayload
  deleteMember: DeleteMemberPayload
  deletePost: DeletePostPayload
  /** Delete reaction. */
  deleteReaction: DeleteReactionPayload
  deleteTeam: DeleteTeamPayload
  /** Disable Boost Module */
  disableBoostModule: DisableBoostModulePayload
  /** Disable Core Value */
  disableCoreValue: DisableCoreValuePayload
  /**
   * Disable daily review.
   *
   * Possible error codes:
   *
   * `DAILY_REVIEW_ALREADY_DISABLED`
   */
  disableDailyReview: DisableDailyReviewPayload
  /** Enable Boost Module */
  enableBoostModule: EnableBoostModulePayload
  /** Enable Core Value */
  enableCoreValue: EnableCoreValuePayload
  /**
   * Exchange invite code for OTP that will be sent to the given email address.
   *
   * Possible error codes:
   *
   * `EMAIL_ALREADY_USED`
   *
   * `INVALID_INVITE_CODE`
   */
  exchangeInviteCodeForOTP: Scalars['Boolean']
  /**
   * Follow member.
   *
   * Possible error codes:
   *
   * `MEMBER_ALREADY_FOLLOWED`
   */
  follow: FollowPayload
  /**
   * Returns an OTP for test automation login
   *
   * `EMAIL_ADDRESS_NOT_FOUND`
   */
  generateLoginOTP: GenerateLoginOtpPayload
  /**
   * Generate upload policy.
   *
   * Possible error codes:
   *
   * `FILE_TYPE_MISSING`
   *
   * `FILE_TYPE_NOT_SUPPORTED`
   */
  generateUploadPolicy: GenerateUploadPolicyPayload
  /**
   * Initialize login sequence when a user enters email.
   * Allows you to determine whether account is passwordless or not.
   * If passwordless, a login code is generated and sent to the user in an email.
   *
   * Possible error codes:
   *
   * `EMAIL_ADDRESS_NOT_FOUND`
   */
  initializeLogin: InitializeLoginPayload
  /**
   * Invite members to organization using their emails.
   * Silently discards invalid emails that are already in use.
   * Returns list of the invited emails.
   */
  inviteMembersByEmails: InviteMembersByEmailsPayload
  /**
   * Pin a post
   *
   * Possible error codes:
   *
   * `INVALID_ACTION`
   *
   * `RESOURCE_NOT_FOUND`
   */
  pinPost: PinPostPayload
  /**
   * Register email with an OTP.
   *
   * Possible error codes:
   *
   * `INVALID EMAIL`
   *
   * `INVALID_OTP`
   */
  registerEmailWithOTP: RegisterEmailWithOtpPayload
  /**
   * Resend email invitations.
   * Silently discards email invitations that don't exist.
   */
  resendEmailInvitations: ResendEmailInvitationsPayload
  /**
   * Resend login code.
   *
   * Possible error codes:
   *
   * `EMAIL_ADDRESS_NOT_FOUND`
   */
  resendLoginCode: Scalars['Boolean']
  /**
   * Save a post
   *
   * Possible error codes:
   *
   * `INVALID_ACTION`
   *
   * `RESOURCE_NOT_FOUND`
   */
  savePost: SavePostPayload
  /** Submit check-in reply. */
  submitCheckInReply: SubmitCheckInReplyPayload
  submitOwnerSurvey: Scalars['Boolean']
  /**
   * Unfollow member.
   *
   * Possible error codes:
   *
   * `MEMBER_NOT_FOLLOWED`
   */
  unfollow: UnfollowPayload
  /**
   * Unpin a post
   *
   * Possible error codes:
   *
   * `INVALID_ACTION`
   *
   * `RESOURCE_NOT_FOUND`
   */
  unpinPost: UnpinPostPayload
  /**
   * Unsave a post
   *
   * Possible error code:
   *
   * `RESOURCE_NOT_FOUND`
   */
  unsavePost: UnsavePostPayload
  /** Update Account Information */
  updateAccount: UpdateAccountPayload
  /** Update check-in answer. */
  updateCheckInAnswer: UpdateCheckInAnswerPayload
  /** Update comment. */
  updateComment: UpdateCommentPayload
  updateCoreValue: UpdateCoreValuePayload
  /** Update and enable the daily review. */
  updateDailyReviewSettings: UpdateDailyReviewSettingsPayload
  /** Update member's direct reports. */
  updateDirectReports: UpdateDirectReportsPayload
  /** Update member profile. */
  updateMember: UpdateMemberPayload
  updateOrganization: UpdateOrganizationPayload
  updatePost: UpdatePostPayload
  updateTeam: UpdateTeamPayload
  /** Verify code from invite link. */
  verifyInviteCode: Scalars['Boolean']
  /**
   * Verify code from member invite link.
   * Returns `token` and `account` if code is valid.
   */
  verifyMemberInviteCode: VerifyMemberInviteCodePayload
}

export type MutationAuthenticateWithCodeArgs = {
  input: AuthenticateWithCodeInput
}

export type MutationAuthenticateWithPasswordArgs = {
  input: AuthenticateWithPasswordInput
}

export type MutationCancelEmailInvitationArgs = {
  input: CancelEmailInvitationInput
}

export type MutationCompleteDailyReviewArgs = {
  input: CompleteDailyReviewInput
}

export type MutationCreateBoostArgs = {
  input: CreateBoostInput
}

export type MutationCreateCheckInAnswerArgs = {
  input: CreateCheckInAnswerInput
}

export type MutationCreateCommentArgs = {
  input: CreateCommentInput
}

export type MutationCreateCoreValueArgs = {
  input: CreateCoreValueInput
}

export type MutationCreateInviteCodeArgs = {
  input: CreateInviteCodeInput
}

export type MutationCreateMoodArgs = {
  input: CreateMoodInput
}

export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput
}

export type MutationCreatePostArgs = {
  input: CreatePostInput
}

export type MutationCreateReactionArgs = {
  input: CreateReactionInput
}

export type MutationCreateTeamArgs = {
  input: CreateTeamInput
}

export type MutationDeactivateAccountArgs = {
  input: DeactivateAccountInput
}

export type MutationDeleteCommentArgs = {
  input: DeleteCommentInput
}

export type MutationDeleteCoreValueArgs = {
  input: DeleteCoreValueInput
}

export type MutationDeleteMemberArgs = {
  input: DeleteMemberInput
}

export type MutationDeletePostArgs = {
  input: DeletePostInput
}

export type MutationDeleteReactionArgs = {
  input: DeleteReactionInput
}

export type MutationDeleteTeamArgs = {
  input: DeleteTeamInput
}

export type MutationDisableCoreValueArgs = {
  input: DisableCoreValueInput
}

export type MutationEnableCoreValueArgs = {
  input: EnableCoreValueInput
}

export type MutationExchangeInviteCodeForOtpArgs = {
  input: ExchangeInviteCodeForOtpInput
}

export type MutationFollowArgs = {
  input: FollowInput
}

export type MutationGenerateLoginOtpArgs = {
  input: GenerateLoginOtpInput
}

export type MutationGenerateUploadPolicyArgs = {
  input: GenerateUploadPolicyInput
}

export type MutationInitializeLoginArgs = {
  input: InitializeLoginInput
}

export type MutationInviteMembersByEmailsArgs = {
  input: InviteMembersByEmailsInput
}

export type MutationPinPostArgs = {
  input: PinPostInput
}

export type MutationRegisterEmailWithOtpArgs = {
  input: RegisterEmailWithOtpInput
}

export type MutationResendEmailInvitationsArgs = {
  input: ResendEmailInvitationsInput
}

export type MutationResendLoginCodeArgs = {
  input: ResendLoginCodeInput
}

export type MutationSavePostArgs = {
  input: SavePostInput
}

export type MutationSubmitCheckInReplyArgs = {
  input: SubmitCheckInReplyInput
}

export type MutationSubmitOwnerSurveyArgs = {
  input: SubmitOwnerSurveyInput
}

export type MutationUnfollowArgs = {
  input: UnFollowInput
}

export type MutationUnpinPostArgs = {
  input: UnpinPostInput
}

export type MutationUnsavePostArgs = {
  input: UnsavePostInput
}

export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput
}

export type MutationUpdateCheckInAnswerArgs = {
  input: UpdateCheckInAnswerInput
}

export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput
}

export type MutationUpdateCoreValueArgs = {
  input: UpdateCoreValueInput
}

export type MutationUpdateDailyReviewSettingsArgs = {
  input: UpdateDailyReviewSettingsInput
}

export type MutationUpdateDirectReportsArgs = {
  input: UpdateDirectReportsInput
}

export type MutationUpdateMemberArgs = {
  input: UpdateMemberInput
}

export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInput
}

export type MutationUpdatePostArgs = {
  input: UpdatePostInput
}

export type MutationUpdateTeamArgs = {
  input: UpdateTeamInput
}

export type MutationVerifyInviteCodeArgs = {
  input: VerifyInviteCodeInput
}

export type MutationVerifyMemberInviteCodeArgs = {
  input: VerifyMemberInviteCodeInput
}

export type NewMemberPost = Commentable &
  Node &
  Post &
  Reactable & {
    __typename?: 'NewMemberPost'
    commented: Scalars['Boolean']
    comments: CommentConnection
    date: Scalars['DateTime']
    id: Scalars['Binary']
    member: Member
    pinned: Scalars['Boolean']
    postTags: Array<PostTag>
    reacted: Scalars['Boolean']
    reactions: Array<Reaction>
    saved: Scalars['Boolean']
    /** @deprecated Use `postTags` instead. */
    tags: Array<Scalars['String']>
    type: Post_Type
  }

export type NewMemberPostCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export type Node = {
  id: Scalars['Binary']
}

export enum Onboarding_Step {
  Completed = 'COMPLETED',
  MemberAccountSetup = 'MEMBER_ACCOUNT_SETUP',
  OwnerAccountSetup = 'OWNER_ACCOUNT_SETUP',
  OwnerCompanySetup = 'OWNER_COMPANY_SETUP',
  OwnerSurvey = 'OWNER_SURVEY',
}

export type Organization = Node & {
  __typename?: 'Organization'
  boostModuleSettings: BoostModuleSettings
  id: Scalars['Binary']
  logo?: Maybe<Scalars['String']>
  name: Scalars['String']
}

export enum Post_Subtype {
  Link = 'LINK',
  Medium = 'MEDIUM',
  Normal = 'NORMAL',
  Spotify = 'SPOTIFY',
  Youtube = 'YOUTUBE',
}

export enum Post_Tag_Id {
  Birthday = 'BIRTHDAY',
  Boost = 'BOOST',
  CheckInSubmitted = 'CHECK_IN_SUBMITTED',
  CompanyAnniversary = 'COMPANY_ANNIVERSARY',
  MemberJoined = 'MEMBER_JOINED',
  SharedAMood = 'SHARED_A_MOOD',
  SharedAPost = 'SHARED_A_POST',
}

export enum Post_Type {
  Anniversary = 'ANNIVERSARY',
  Birthday = 'BIRTHDAY',
  Boost = 'BOOST',
  Broadcast = 'BROADCAST',
  CheckIn = 'CHECK_IN',
  Mood = 'MOOD',
  NewMember = 'NEW_MEMBER',
}

export enum Post_Type_Filter {
  Anniversary = 'ANNIVERSARY',
  Birthday = 'BIRTHDAY',
  Boost = 'BOOST',
  Broadcast = 'BROADCAST',
  CheckIn = 'CHECK_IN',
  Events = 'EVENTS',
  Mood = 'MOOD',
  NewMember = 'NEW_MEMBER',
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['Binary']>
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['Binary']>
}

export type PinPostInput = {
  postId: Scalars['Binary']
}

export type PinPostPayload = {
  __typename?: 'PinPostPayload'
  post: Post
}

export type Post = {
  date: Scalars['DateTime']
  id: Scalars['Binary']
  member: Member
  pinned: Scalars['Boolean']
  postTags: Array<PostTag>
  saved: Scalars['Boolean']
  /** @deprecated Use `postTags` instead. */
  tags: Array<Scalars['String']>
  type: Post_Type
}

export type PostConnection = {
  __typename?: 'PostConnection'
  edges: Array<PostEdge>
  pageInfo: PageInfo
}

export type PostEdge = {
  __typename?: 'PostEdge'
  cursor: Scalars['Binary']
  node: Post
}

export type PostTag = {
  __typename?: 'PostTag'
  activityFeedText: Scalars['String']
  profileFeedText: Scalars['String']
  tagId: Post_Tag_Id
}

export type PostTypeAltFilterInput = {
  eq?: Maybe<Post_Type_Filter>
  in?: Maybe<Array<Post_Type_Filter>>
}

export type PostTypeFilterInput = {
  eq?: Maybe<Post_Type_Filter>
  in?: Maybe<Array<Post_Type_Filter>>
}

export type PostsFilterInput = {
  accountId?: Maybe<BinaryQueryOperatorInput>
  date?: Maybe<DateQueryOperatorInput>
  followedUsersOnly?: Maybe<Scalars['Boolean']>
  team?: Maybe<BinaryQueryOperatorInput>
  type?: Maybe<PostTypeFilterInput>
}

export type PreviousCheckInGoals = {
  __typename?: 'PreviousCheckInGoals'
  date: Scalars['DateTime']
  tasks: Array<CheckInAnswerTask>
}

export type Query = {
  __typename?: 'Query'
  /** Retrieve account info of current user. */
  account: Account
  /** Retrieve boost background images. */
  boostBackgroundImages: Array<BoostBackgroundImage>
  /**
   * Retrieve comments on a `Commentable` object given by `parentId`.
   * Filter for `parentId` only supports `eq` operator.
   */
  comments: CommentConnection
  /** Retrieve core values. */
  coreValues: Array<CoreValue>
  /** Retrieve daily review for the day. */
  dailyReview?: Maybe<DailyReview>
  /**
   * Retrieve daily review check-in form.
   * Note: Use `DailyReview.checkInForm` instead. You can get it by calling `Query.dailyReview`.
   */
  dailyReviewCheckInForm?: Maybe<CheckInReplyForm>
  /** Retrieve paginated daily review entries. */
  dailyReviewEntries: DailyReviewEntryConnection
  /**
   * Retrieve daily review entry for the day.
   * Provide `startOfDay` reference for start of day of user's local timezone.
   */
  dailyReviewEntry?: Maybe<DailyReviewEntry>
  dailyReviewSessions: DailyReviewSessionConnection
  /** Retrieve daily review settings. */
  dailyReviewSettings?: Maybe<DailyReviewSettings>
  /** Retrieve daily review streak. */
  dailyReviewStreak: Scalars['Int']
  dailyReviewSubmitCount: Scalars['Int']
  dashboardMetrics: DashboardMetrics
  /** Retrieve direct report selections for a specific member. */
  directReportSelection: Array<Member>
  /** Retrieve direct reports. */
  directReports?: Maybe<Array<DirectReport>>
  /** Retrieve list of invited emails. */
  invitedEmails: Array<Scalars['EmailAddress']>
  /**
   * Retrieve member information of the current user.
   * If `null`, it means that the user has no associated organization yet.
   */
  me: Member
  /** Retrieve members. */
  members: Array<Member>
  /** Return the minimum and latest versions of the mobile app */
  mobileVersions: MobileVersionsPayload
  moodCount: Scalars['Int']
  /**
   * Determine whether mood entry is required.
   * Note: Use `DailyReview.moodEnabled` and `DailyReview.moodSubmitted` instead.
   * You can get it by calling `Query.dailyReview`.
   */
  moodEntryRequired: Scalars['Boolean']
  /** Retrieve mood entry history. */
  moodHistory: Array<Maybe<MoodEntry>>
  /** Retrieve mood metrics. Use `date` filter to specify period. */
  moodMetrics: Array<MoodMetrics>
  /** Retrieve node by `id`. */
  node: Node
  /** Retrieve current organization. */
  organization: Organization
  /** Retrieve pinned posts. */
  pinnedPosts?: Maybe<PostConnection>
  /** Retrieve posts. */
  posts: PostConnection
  /**
   * Retrieve reactions on a `Reactable` object given by `parentId`.
   * Filter for `parentId` only supports `eq` operator.
   */
  reactions: Array<Reaction>
  /** Retrieve saved posts. */
  savedPosts?: Maybe<PostConnection>
  teams: Array<Team>
  /** Retrieve list of time-offs. */
  timeOffs: Array<TimeOff>
  /**
   * Check the mobile app version
   * @deprecated Refer to `mobileVersions` instead.
   */
  versionCheck: Scalars['String']
}

export type QueryCommentsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  filter: CommentsFilterInput
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
  sort?: Maybe<CommentsPageSort>
}

export type QueryCoreValuesArgs = {
  filter?: Maybe<CoreValueFilter>
}

export type QueryDailyReviewArgs = {
  startOfDay?: Maybe<Scalars['DateTime']>
}

export type QueryDailyReviewEntriesArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  filter?: Maybe<DailyReviewEntriesFilterInput>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
}

export type QueryDailyReviewEntryArgs = {
  startOfDay: Scalars['DateTime']
}

export type QueryDailyReviewSessionsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  filter?: Maybe<DailyReviewSessionsFilterInput>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
}

export type QueryDailyReviewSubmitCountArgs = {
  filter: DailyReviewSubmitCountFilter
}

export type QueryDirectReportSelectionArgs = {
  filter: DirectReportSelectionFilterInput
}

export type QueryMobileVersionsArgs = {
  input: MobileVersionsInput
}

export type QueryMoodCountArgs = {
  filter: MoodCountFilterInput
}

export type QueryMoodHistoryArgs = {
  filter: MoodHistoryFilterInput
}

export type QueryMoodMetricsArgs = {
  filter?: Maybe<MoodMetricsFilterInput>
}

export type QueryNodeArgs = {
  id: Scalars['Binary']
}

export type QueryPinnedPostsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
}

export type QueryPostsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  filter?: Maybe<PostsFilterInput>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
}

export type QueryReactionsArgs = {
  filter: ReactionsFilterInput
}

export type QuerySavedPostsArgs = {
  after?: Maybe<Scalars['Binary']>
  before?: Maybe<Scalars['Binary']>
  first?: Maybe<Scalars['Int']>
  last?: Maybe<Scalars['Int']>
}

export type QueryTimeOffsArgs = {
  filter: TimeOffsFilterInput
}

export type QueryVersionCheckArgs = {
  input: VersionCheckInput
}

export type Reactable = {
  reacted: Scalars['Boolean']
  reactions: Array<Reaction>
}

export type Reaction = {
  __typename?: 'Reaction'
  emoji: Scalars['String']
  id: Scalars['Binary']
  member: Member
}

export type ReactionsFilterInput = {
  parentId: BinaryQueryOperatorInput
}

export type RegisterEmailWithOtpInput = {
  email: Scalars['EmailAddress']
  otp: Scalars['String']
}

export type RegisterEmailWithOtpPayload = {
  __typename?: 'RegisterEmailWithOTPPayload'
  account: Account
  token: Scalars['String']
}

export type ResendEmailInvitationsInput = {
  emails: Array<Scalars['EmailAddress']>
}

export type ResendEmailInvitationsPayload = {
  __typename?: 'ResendEmailInvitationsPayload'
  emails: Array<Scalars['EmailAddress']>
}

export type ResendLoginCodeInput = {
  email: Scalars['EmailAddress']
}

export enum Sentiment_Level {
  Agree = 'AGREE',
  Disagree = 'DISAGREE',
  StronglyAgree = 'STRONGLY_AGREE',
  StronglyDisagree = 'STRONGLY_DISAGREE',
  Undecided = 'UNDECIDED',
}

export type SavePostInput = {
  postId: Scalars['Binary']
}

export type SavePostPayload = {
  __typename?: 'SavePostPayload'
  post: Post
}

export type SocialMediaHandle = {
  __typename?: 'SocialMediaHandle'
  url: Scalars['String']
  website: Scalars['String']
}

export type SocialMediaHandleInput = {
  url: Scalars['String']
  website: Scalars['String']
}

export type Status = Node &
  TimeOff & {
    __typename?: 'Status'
    category: StatusCategory
    color: Scalars['String']
    description?: Maybe<Scalars['String']>
    duration: Scalars['String']
    from: Scalars['DateTime']
    id: Scalars['Binary']
    member: Member
    to: Scalars['DateTime']
    type: Time_Off_Type
  }

export type StatusCategory = Node & {
  __typename?: 'StatusCategory'
  color: Scalars['String']
  id: Scalars['Binary']
  isDefault: Scalars['Boolean']
  name: Scalars['String']
}

export type SubmitCheckInReplyInput = {
  checkInReplyFormId: Scalars['Binary']
}

export type SubmitCheckInReplyPayload = {
  __typename?: 'SubmitCheckInReplyPayload'
  submitted: Scalars['Boolean']
}

export type SubmitOwnerSurveyInput = {
  purpose: Array<Scalars['String']>
}

export enum Time_Off_Type {
  Holiday = 'HOLIDAY',
  Status = 'STATUS',
}

export type Team = Node & {
  __typename?: 'Team'
  color?: Maybe<Scalars['String']>
  id: Scalars['Binary']
  isDefault: Scalars['Boolean']
  members: Array<Member>
  name: Scalars['String']
}

export type TimeOff = {
  duration: Scalars['String']
  from: Scalars['DateTime']
  id: Scalars['Binary']
  to: Scalars['DateTime']
  type: Time_Off_Type
}

export type TimeOffsFilterInput = {
  lowerBoundary: Scalars['DateTime']
  upperBoundary: Scalars['DateTime']
}

export type UnFollowInput = {
  accountId: Scalars['Binary']
}

export type UnfollowPayload = {
  __typename?: 'UnfollowPayload'
  unfollowed: Scalars['Boolean']
}

export type UnpinPostInput = {
  postId: Scalars['Binary']
}

export type UnpinPostPayload = {
  __typename?: 'UnpinPostPayload'
  unpinned: Scalars['Boolean']
}

export type UnsavePostInput = {
  postId: Scalars['Binary']
}

export type UnsavePostPayload = {
  __typename?: 'UnsavePostPayload'
  deleted: Scalars['Boolean']
}

export type UpdateAccountInput = {
  body: UpdateAccountInputBody
}

export type UpdateAccountInputBody = {
  name: Scalars['String']
  role: Scalars['String']
  roleDescription?: Maybe<Scalars['String']>
  timezone: Scalars['Timezone']
}

export type UpdateAccountPayload = {
  __typename?: 'UpdateAccountPayload'
  account: Account
}

export type UpdateCheckInAnswerBody = {
  bool?: Maybe<Scalars['Boolean']>
  emoji?: Maybe<Scalars['String']>
  number?: Maybe<Scalars['Int']>
  sentiment?: Maybe<Sentiment_Level>
  tasks?: Maybe<Array<UpdateCheckInAnswerTaskInput>>
  text?: Maybe<Scalars['NonEmptyString']>
}

export type UpdateCheckInAnswerInput = {
  body: UpdateCheckInAnswerBody
  id: Scalars['Binary']
}

export type UpdateCheckInAnswerPayload = {
  __typename?: 'UpdateCheckInAnswerPayload'
  answer: CheckInAnswer
}

export type UpdateCheckInAnswerTaskInput = {
  description?: Maybe<Scalars['String']>
  done: Scalars['Boolean']
  text: Scalars['NonEmptyString']
}

export type UpdateCommentBody = {
  content: Scalars['NonEmptyString']
}

export type UpdateCommentInput = {
  body: UpdateCommentBody
  id: Scalars['Binary']
}

export type UpdateCommentPayload = {
  __typename?: 'UpdateCommentPayload'
  comment: Comment
  /** @deprecated Refer to `comment` object instead. */
  id: Scalars['Binary']
  /** @deprecated Refer to `comment` object instead. */
  updatedAt: Scalars['DateTime']
}

export type UpdateCoreValueBody = {
  description?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type UpdateCoreValueInput = {
  body: UpdateCoreValueBody
  id: Scalars['Binary']
}

export type UpdateCoreValuePayload = {
  __typename?: 'UpdateCoreValuePayload'
  coreValue: CoreValue
}

export type UpdateDailyReviewSettingsBody = {
  checkInEnabled: Scalars['Boolean']
  /** Required to be not null and non-empty when `checkInEnabled` is set to `true`. */
  checkInQuestions?: Maybe<Array<DailyReviewCheckInQuestionInput>>
  companyEventsEnabled: Scalars['Boolean']
  duration: Scalars['Int']
  moodEnabled: Scalars['Boolean']
  remindOnMissingResponse: Scalars['Boolean']
  remindOnMissingResponseAfter: Scalars['Int']
  respondentIds: Array<Scalars['Binary']>
  sendRemindersToEmail: Scalars['Boolean']
  time: Scalars['MilitaryTimeFormat']
  timezone?: Maybe<Scalars['Timezone']>
}

export type UpdateDailyReviewSettingsInput = {
  body: UpdateDailyReviewSettingsBody
}

export type UpdateDailyReviewSettingsPayload = {
  __typename?: 'UpdateDailyReviewSettingsPayload'
  dailyReviewSettings: DailyReviewSettings
}

export type UpdateDirectReportsInput = {
  accountIds?: Maybe<Array<Scalars['Binary']>>
}

export type UpdateDirectReportsPayload = {
  __typename?: 'UpdateDirectReportsPayload'
  directReports?: Maybe<Array<Maybe<Member>>>
}

export type UpdateMemberBody = {
  about?: Maybe<Scalars['String']>
  avatar?: Maybe<Scalars['String']>
  birthdate?: Maybe<Scalars['DateTime']>
  cover?: Maybe<Scalars['String']>
  employmentDate?: Maybe<Scalars['DateTime']>
  links?: Maybe<Array<SocialMediaHandleInput>>
  location?: Maybe<Scalars['String']>
  magicLogin?: Maybe<MagicLoginInput>
  name?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  role?: Maybe<Scalars['String']>
  teams?: Maybe<Array<Scalars['Binary']>>
  timezone?: Maybe<Scalars['Timezone']>
  type?: Maybe<Member_Type_Update_Options>
}

export type UpdateMemberInput = {
  body: UpdateMemberBody
  id: Scalars['Binary']
}

export type UpdateMemberPayload = {
  __typename?: 'UpdateMemberPayload'
  member: Member
}

export type UpdateOrganizationBody = {
  logo?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type UpdateOrganizationInput = {
  body: UpdateOrganizationBody
}

export type UpdateOrganizationPayload = {
  __typename?: 'UpdateOrganizationPayload'
  organization: Organization
}

export type UpdatePostBody = {
  body?: Maybe<Scalars['String']>
  media?: Maybe<Array<BroadcastMediaInput>>
  title?: Maybe<Scalars['String']>
}

export type UpdatePostInput = {
  body: UpdatePostBody
  id: Scalars['Binary']
}

export type UpdatePostPayload = {
  __typename?: 'UpdatePostPayload'
  cursor: Scalars['Binary']
  post: BroadcastPost
}

export type UpdateTeamBody = {
  color?: Maybe<Scalars['String']>
  memberIds?: Maybe<Array<Scalars['Binary']>>
  name?: Maybe<Scalars['String']>
}

export type UpdateTeamInput = {
  body: UpdateTeamBody
  id: Scalars['Binary']
}

export type UpdateTeamPayload = {
  __typename?: 'UpdateTeamPayload'
  team: Team
}

export type UploadPolicyCredentials = {
  __typename?: 'UploadPolicyCredentials'
  origin: Scalars['String']
  params: UploadPolicyCredentialsParams
  url: Scalars['String']
}

export type UploadPolicyCredentialsParams = {
  __typename?: 'UploadPolicyCredentialsParams'
  acl: Scalars['String']
  algorithm: Scalars['String']
  credential: Scalars['String']
  date: Scalars['String']
  key: Scalars['String']
  policy: Scalars['String']
  signature: Scalars['String']
  successActionStatus: Scalars['String']
}

export type VerifyInviteCodeInput = {
  code: Scalars['String']
}

export type VerifyMemberInviteCodeInput = {
  code: Scalars['String']
}

export type VerifyMemberInviteCodePayload = {
  __typename?: 'VerifyMemberInviteCodePayload'
  account: Account
  token: Scalars['String']
}

export type VersionCheckInput = {
  platform: Scalars['String']
}

export type Workspace = {
  __typename?: 'Workspace'
  boostBackgroundImages: Array<BoostBackgroundImage>
  coreValues: Array<CoreValue>
  me: Member
  members: Array<Member>
  organization: Organization
}
