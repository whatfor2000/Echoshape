-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastChargeId" VARCHAR(64),
ADD COLUMN     "maxGenerate" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nextBillingAt" TIMESTAMP(3),
ADD COLUMN     "omiseCardId" VARCHAR(64),
ADD COLUMN     "omiseCustomerId" VARCHAR(64),
ADD COLUMN     "omiseScheduleId" VARCHAR(64),
ADD COLUMN     "planId" VARCHAR(64),
ADD COLUMN     "subscriptionStatus" TEXT DEFAULT 'inactive',
ADD COLUMN     "usedThisMonth" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."ProcessedEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Charge" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "promptpayUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "src" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedEvent_eventId_key" ON "public"."ProcessedEvent"("eventId");

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
