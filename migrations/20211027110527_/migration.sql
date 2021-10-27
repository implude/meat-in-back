-- CreateTable
CREATE TABLE "Badge" (
    "id" UUID NOT NULL,
    "image" TEXT NOT NULL DEFAULT E'',
    "label" TEXT NOT NULL DEFAULT E'',
    "description" TEXT NOT NULL DEFAULT E'',
    "owner" UUID,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL DEFAULT E'',
    "author" UUID,
    "post" UUID,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Difficulty" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL DEFAULT E'',
    "numeric_level" INTEGER NOT NULL,

    CONSTRAINT "Difficulty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeatType" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "MeatType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT E'',
    "photo" JSONB,
    "content" TEXT NOT NULL DEFAULT E'',
    "author" UUID,
    "linked_recipe" UUID,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" UUID NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT E'',
    "name" TEXT NOT NULL DEFAULT E'',
    "description" TEXT NOT NULL DEFAULT E'',
    "author" UUID,
    "duration" INTEGER NOT NULL,
    "difficulty" UUID,
    "youtube" TEXT NOT NULL DEFAULT E'',
    "ingredient" JSONB,
    "created_at" TIMESTAMP(3),
    "meat_type" UUID,
    "steps" JSONB,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "photo" TEXT NOT NULL DEFAULT E'',
    "email" TEXT NOT NULL DEFAULT E'',
    "password" TEXT NOT NULL,
    "rep_badge" UUID,
    "bookmarked_post" UUID,
    "bookmarked_recipe" UUID,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Post_hearted_user_User_hearted_post" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_Recipe_hearted_user_User_hearted_recipe" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE INDEX "Badge_owner_idx" ON "Badge"("owner");

-- CreateIndex
CREATE INDEX "Comment_author_idx" ON "Comment"("author");

-- CreateIndex
CREATE INDEX "Comment_post_idx" ON "Comment"("post");

-- CreateIndex
CREATE INDEX "Post_author_idx" ON "Post"("author");

-- CreateIndex
CREATE INDEX "Post_linked_recipe_idx" ON "Post"("linked_recipe");

-- CreateIndex
CREATE INDEX "Recipe_author_idx" ON "Recipe"("author");

-- CreateIndex
CREATE INDEX "Recipe_difficulty_idx" ON "Recipe"("difficulty");

-- CreateIndex
CREATE INDEX "Recipe_meat_type_idx" ON "Recipe"("meat_type");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_rep_badge_idx" ON "User"("rep_badge");

-- CreateIndex
CREATE INDEX "User_bookmarked_post_idx" ON "User"("bookmarked_post");

-- CreateIndex
CREATE INDEX "User_bookmarked_recipe_idx" ON "User"("bookmarked_recipe");

-- CreateIndex
CREATE UNIQUE INDEX "_Post_hearted_user_User_hearted_post_AB_unique" ON "_Post_hearted_user_User_hearted_post"("A", "B");

-- CreateIndex
CREATE INDEX "_Post_hearted_user_User_hearted_post_B_index" ON "_Post_hearted_user_User_hearted_post"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Recipe_hearted_user_User_hearted_recipe_AB_unique" ON "_Recipe_hearted_user_User_hearted_recipe"("A", "B");

-- CreateIndex
CREATE INDEX "_Recipe_hearted_user_User_hearted_recipe_B_index" ON "_Recipe_hearted_user_User_hearted_recipe"("B");

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_fkey" FOREIGN KEY ("post") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_linked_recipe_fkey" FOREIGN KEY ("linked_recipe") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_difficulty_fkey" FOREIGN KEY ("difficulty") REFERENCES "Difficulty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_meat_type_fkey" FOREIGN KEY ("meat_type") REFERENCES "MeatType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rep_badge_fkey" FOREIGN KEY ("rep_badge") REFERENCES "Badge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bookmarked_post_fkey" FOREIGN KEY ("bookmarked_post") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bookmarked_recipe_fkey" FOREIGN KEY ("bookmarked_recipe") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Post_hearted_user_User_hearted_post" ADD FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Post_hearted_user_User_hearted_post" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Recipe_hearted_user_User_hearted_recipe" ADD FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Recipe_hearted_user_User_hearted_recipe" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
