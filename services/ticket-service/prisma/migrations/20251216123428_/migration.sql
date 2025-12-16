-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_eventId_seatNumber_key" ON "Ticket"("eventId", "seatNumber");
