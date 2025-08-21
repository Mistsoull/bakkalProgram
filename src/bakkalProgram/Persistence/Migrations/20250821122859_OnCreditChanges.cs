using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class OnCreditChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "OnCredits",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeName",
                table: "OnCredits",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<Guid>(
                name: "CustomerId",
                table: "OnCredits",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "OnCredits",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerSurname",
                table: "OnCredits",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmployeeSurname",
                table: "OnCredits",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OnCredits_CustomerId",
                table: "OnCredits",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_OnCredits_Customers_CustomerId",
                table: "OnCredits",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OnCredits_Customers_CustomerId",
                table: "OnCredits");

            migrationBuilder.DropIndex(
                name: "IX_OnCredits_CustomerId",
                table: "OnCredits");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "OnCredits");

            migrationBuilder.DropColumn(
                name: "CustomerName",
                table: "OnCredits");

            migrationBuilder.DropColumn(
                name: "CustomerSurname",
                table: "OnCredits");

            migrationBuilder.DropColumn(
                name: "EmployeeSurname",
                table: "OnCredits");

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "OnCredits",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeName",
                table: "OnCredits",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
